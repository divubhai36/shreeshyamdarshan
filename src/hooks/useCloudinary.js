import { useState } from 'react';
import toast from 'react-hot-toast';

export const useCloudinary = () => {
    const [uploading, setUploading] = useState(false);

    /**
     * Upload one file to all configured Cloudinary accounts in parallel
     */
    const uploadToAllAccounts = async (file, mode = 'image') => {
        setUploading(true);
        try {
            if (mode === 'video') {
                const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB
                if (file.size > MAX_VIDEO_SIZE) {
                    toast.error("Video exceeds 20MB limit. Please compress before uploading.");
                    throw new Error("Video size exceeds 20MB limit.");
                }
            }

            // 1. Get signatures for all accounts
            const sigRes = await fetch(`/api/upload/signatures?mode=${mode}`);
            const { signatures, error } = await sigRes.json();
            
            if (error) throw new Error(error);

            // 2. Prepare upload promises
            const uploadPromises = signatures.map(async (acc) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", acc.apiKey);
                formData.append("timestamp", acc.timestamp);
                formData.append("signature", acc.signature);
                formData.append("folder", acc.folder);
                formData.append("public_id", acc.public_id);
                if (acc.eager) {
                    formData.append("eager", acc.eager);
                }

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${acc.cloudName}/auto/upload`,
                    { method: "POST", body: formData }
                );
                
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const errMsg = errData.error?.message || "Unknown error";
                    console.error(`Upload failed for account ${acc.cloudName}:`, errMsg);
                    return { error: errMsg, cloudName: acc.cloudName };
                }
                return response.json();
            });

            // 3. Execute all uploads in parallel
            const results = await Promise.all(uploadPromises);
            
            // 4. Validate results (At least one must succeed)
            const successful = results.find(r => r && !r.error);
            if (!successful) {
                const errors = results.map(r => r?.error ? `${r.cloudName}: ${r.error}` : "Unknown error").join(", ");
                throw new Error(`All upload attempts failed. Details: ${errors}`);
            }

            return {
                public_id: successful.public_id,
                secure_url: successful.secure_url,
                format: successful.format
            };

        } catch (err) {
            console.error("Cloudinary Sync Upload Error:", err);
            toast.error(`Cloudinary Sync Failed: ${err.message}`);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return { uploadToAllAccounts, uploading };
};
