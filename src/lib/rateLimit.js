import prisma from './prisma';

/**
 * Smart Rate Limiter
 * @param {string} ip - User IP Address
 * @param {string} action - 'inquiry' | 'login' | 'order'
 * @param {number} limit - Max allowed requests per hour
 * @returns {Promise<{allowed: boolean, remaining: number}>}
 */
export async function checkRateLimit(ip, action, limit) {
    if (!ip) return { allowed: true, remaining: 1 };

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    try {
        // 1. Atomically upsert the record
        // If it's a new IP, create it. If it exists, we'll check logic below.
        let record = await prisma.rateLimit.upsert({
            where: { ip },
            create: { 
                ip, 
                [action + 'Count']: 1, 
                lastReset: now 
            },
            update: {} // No-op update just to get the record if it exists
        });

        // 2. Check if we need to reset the hourly window
        if (record.lastReset < oneHourAgo) {
            record = await prisma.rateLimit.update({
                where: { ip },
                data: {
                    inquiryCount: 0,
                    loginCount: 0,
                    orderCount: 0,
                    lastReset: now,
                    [action + 'Count']: 1
                }
            });
            return { allowed: true, remaining: limit - 1 };
        }

        // 3. Check the specific action limit
        const currentCount = record[action + 'Count'];
        
        if (currentCount >= limit) {
            return { allowed: false, remaining: 0 };
        }

        // 4. Increment the count atomically
        await prisma.rateLimit.update({
            where: { ip },
            data: {
                [action + 'Count']: { increment: 1 }
            }
        });

        return { allowed: true, remaining: limit - (currentCount + 1) };

    } catch (error) {
        console.error("RateLimit Error:", error);
        // Fallback: allow request if DB fails to avoid blocking real users
        return { allowed: true, remaining: 1 };
    }
}
