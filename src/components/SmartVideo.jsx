"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { getCachedBlob, saveToCache } from '@/lib/cacheService';

// Global map to track in-flight requests to prevent duplicate fetches
const pendingRequests = {};

export default function SmartVideo({ 
    id, 
    url, 
    className = "", 
    autoPlay = false,
    muted = false,
    loop = false,
    playsInline = true
}) {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) return;

        let objectUrl = null;

        const fetchVideo = async () => {
            try {
                // 1. Check Cache First (in customer-review store)
                const cachedBlob = await getCachedBlob(id, 'customer-review');
                if (cachedBlob) {
                    objectUrl = URL.createObjectURL(cachedBlob);
                    setSrc(objectUrl);
                    setLoading(false);
                    return;
                }

                // 2. Prevent Duplicate Concurrent Requests
                if (pendingRequests[id]) {
                    await pendingRequests[id];
                    const reCheckBlob = await getCachedBlob(id, 'customer-review');
                    if (reCheckBlob) {
                        objectUrl = URL.createObjectURL(reCheckBlob);
                        setSrc(objectUrl);
                        setLoading(false);
                        return;
                    }
                }

                // Create a new promise for this fetch
                pendingRequests[id] = (async () => {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) throw new Error("Video fetch failed");
                        const blob = await response.blob();

                        // 3. Store in Cache (customer-review store)
                        await saveToCache(id, blob, 'customer-review');
                        return blob;
                    } finally {
                        delete pendingRequests[id];
                    }
                })();

                const freshBlob = await pendingRequests[id];
                objectUrl = URL.createObjectURL(freshBlob);
                setSrc(objectUrl);
                setLoading(false);
            } catch (err) {
                console.error("SmartVideo Cache Error:", err);
                // Fallback to direct URL if caching fails
                setSrc(url);
                setLoading(false);
            }
        };

        fetchVideo();

        return () => {
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [id, url]);

    if (error) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center text-gray-300 ${className}`}>
                <Icon icon="solar:video-library-broken-bold" className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-brand-primary/5 animate-pulse flex flex-col items-center justify-center">
                    <Icon icon="line-md:loading-loop" className="w-8 h-8 text-brand-secondary mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary/40">Buffering...</span>
                </div>
            )}
            
            {src && (
                <video 
                    src={src} 
                    autoPlay={autoPlay}
                    muted={muted}
                    loop={loop}
                    playsInline={playsInline}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
                />
            )}
        </div>
    );
}
