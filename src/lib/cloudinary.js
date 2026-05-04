"use server";
import { v2 as cloudinary } from 'cloudinary';
import prisma from './prisma';

/**
 * Cloudinary Manager - Handles Multi-Account logic, signatures, and usage tracking.
 */

export async function getCloudinaryAccounts(mode = 'image') {
    try {
        const envVar = mode === 'video' ? process.env.VIDEO_CLOUDINARY_ACCOUNTS : process.env.IMAGE_CLOUDINARY_ACCOUNTS;
        // Fallback to CLOUDINARY_ACCOUNTS for backward compatibility if needed, but prefer split
        const accountsStr = envVar || process.env.CLOUDINARY_ACCOUNTS || '[]';
        const accounts = JSON.parse(accountsStr);
        return accounts;
    } catch (error) {
        console.error(`Failed to parse ${mode === 'video' ? 'VIDEO_CLOUDINARY_ACCOUNTS' : 'IMAGE_CLOUDINARY_ACCOUNTS'}:`, error);
        return [];
    }
}

/**
 * Get usage stats for all accounts
 */
export async function getAllAccountsUsage() {
    const imageAccounts = await getCloudinaryAccounts('image');
    const videoAccounts = await getCloudinaryAccounts('video');
    
    const fetchUsage = async (acc, index, type) => {
        try {
            const instance = cloudinary;
            instance.config({
                cloud_name: acc.name,
                api_key: acc.key,
                api_secret: acc.secret,
                secure: true
            });

            const res = await instance.api.usage();
            return {
                index,
                type,
                name: acc.name,
                plan: res.plan,
                lastUpdated: res.last_updated,
                credits: {
                    used: res.credits.usage,
                    limit: res.credits.limit,
                    percent: res.credits.used_percent
                },
                bandwidth: {
                    used: res.bandwidth.usage,
                    limit: res.bandwidth.limit,
                    percent: res.bandwidth.used_percent
                },
                storage: {
                    used: res.objects.usage,
                    limit: res.objects.limit,
                    percent: res.objects.used_percent
                },
                transformations: {
                    used: res.transformations.usage,
                    limit: res.transformations.limit,
                    percent: res.transformations.used_percent
                },
                requests: res.requests || 0,
                status: res.credits.used_percent > 90 ? 'critical' : 'healthy'
            };
        } catch (error) {
            console.error(`Failed to fetch usage for ${acc.name}:`, error);
            return { index, type, name: acc.name, error: true };
        }
    };

    const imageUsage = await Promise.all(imageAccounts.map((acc, i) => fetchUsage(acc, i, 'image')));
    const videoUsage = await Promise.all(videoAccounts.map((acc, i) => fetchUsage(acc, i, 'video')));

    return [...imageUsage, ...videoUsage];
}

/**
 * Check and Auto-Switch account if threshold reached
 */
export async function autoCheckAndSwitchAccount(force = false) {
    const config = await prisma.appConfig.findUnique({ where: { id: 1 } });
    if (!config || (!config.isAutoSwitchEnabled && !force)) return null;

    // 5-minute cooldown for automatic checks (skip if force is true)
    const now = new Date();
    if (!force && config.lastUsageCheck && (now - new Date(config.lastUsageCheck)) < 5 * 60 * 1000) {
        return null;
    }

    const accounts = await getCloudinaryAccounts();
    const currentIndex = config.activeCloudinaryIndex;
    const currentAccount = accounts[currentIndex];

    if (!currentAccount) return null;

    try {
        cloudinary.config({
            cloud_name: currentAccount.name,
            api_key: currentAccount.key,
            api_secret: currentAccount.secret,
        });

        const usage = await cloudinary.api.usage();
        const used = usage.credits.used;
        const THRESHOLD = 23; // Hard-coded safety threshold in credits (GB)

        // Update the timestamp in DB
        await prisma.appConfig.update({
            where: { id: 1 },
            data: { lastUsageCheck: now }
        });

        if (used >= THRESHOLD) {
            console.log(`Threshold reached for Account ${currentIndex} (${used}GB). Looking for next...`);
            
            for (let i = 0; i < accounts.length; i++) {
                if (i === currentIndex) continue;
                
                const nextAcc = accounts[i];
                cloudinary.config({ cloud_name: nextAcc.name, api_key: nextAcc.key, api_secret: nextAcc.secret });
                const nextUsage = await cloudinary.api.usage();
                
                if (nextUsage.credits.used < THRESHOLD) {
                    await prisma.appConfig.update({
                        where: { id: 1 },
                        data: { activeCloudinaryIndex: i }
                    });
                    console.log(`Switched to Account ${i} (${nextAcc.name})`);
                    return i;
                }
            }
            console.warn("All Cloudinary accounts have reached the 23GB threshold!");
        }
    } catch (err) {
        console.error("Auto-switch check failed:", err);
    }
    return null;
}

/**
 * Generate Signatures for Client-Side Parallel Upload
 */
export async function getUploadSignatures(timestamp, mode = 'image') {
    const accounts = await getCloudinaryAccounts(mode);
    // Generate a common ID prefix for this upload batch
    const commonId = `sh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    return accounts.map(acc => {
        const params = { 
            timestamp, 
            folder: 'shreeshyamdarshan',
            public_id: commonId
        };

        // For video mode, add eager transformations for auto-compression
        if (mode === 'video') {
            params.eager = 'f_auto,q_auto';
        }
        
        const signature = cloudinary.utils.api_sign_request(params, acc.secret);
        
        return {
            cloudName: acc.name,
            apiKey: acc.key,
            signature,
            timestamp,
            folder: 'shreeshyamdarshan',
            public_id: commonId,
            eager: params.eager
        };
    });
}

/**
 * Delete one or more assets from all configured Cloudinary accounts
 */
export async function deleteFromAllAccounts(publicIds, mode = 'image') {
    if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) return;
    
    const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
    const accounts = await getCloudinaryAccounts(mode);
    
    const deletePromises = accounts.flatMap(acc => 
        ids.map(id => {
            // Configure temporary instance for this account
            const instance = cloudinary;
            instance.config({
                cloud_name: acc.name,
                api_key: acc.key,
                api_secret: acc.secret,
                secure: true
            });
            return instance.uploader.destroy(id).catch(err => {
                console.error(`Failed to delete ${id} from ${acc.name}:`, err);
                return null;
            });
        })
    );

    await Promise.all(deletePromises);
}
