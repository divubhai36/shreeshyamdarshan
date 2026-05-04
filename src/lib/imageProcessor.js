/**
 * Smart Image Processor - Handles compression and smart resizing
 */

export const compressAndResizeImage = (file, type = 'product') => {
    return new Promise((resolve, reject) => {
        // Set maxWidth based on type
        let maxWidth = 1200; // Default for products
        if (type === 'category') maxWidth = 800;
        if (type === 'banner') maxWidth = 1920;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Apply smart resizing
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Use better image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error("Canvas to Blob failed"));
                    
                    // Create a new file with .webp extension
                    const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    const newFile = new File([blob], newFileName, { type: 'image/webp' });
                    
                    resolve({
                        file: newFile,
                        preview: URL.createObjectURL(blob),
                        width,
                        height,
                        originalSize: file.size,
                        compressedSize: blob.size,
                        reduction: ((file.size - blob.size) / file.size * 100).toFixed(2) + '%'
                    });
                }, 'image/webp', 0.8); // 0.8 is the sweet spot for WebP quality
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
