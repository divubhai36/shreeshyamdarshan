"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { getCachedBlob, saveToCache } from '@/lib/cacheService';

// Global map to track in-flight requests to prevent duplicate fetches
const pendingRequests = {};

export default function SmartImage({ 
    id, 
    alt = "Shree Shyam Darshan Asset", 
    className = "", 
    type = "image", 
    priority = false 
}) {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        let objectUrl = null;

        // If it's already a full URL or local path, use it directly
        if (id.startsWith('http') || id.startsWith('blob:') || id.startsWith('/')) {
            setSrc(id);
            setLoading(false);
            return;
        }

        const fetchAsset = async () => {
            try {
                // 1. Check Cache First (Using Centralized Service)
                const cachedBlob = await getCachedBlob(id);
                if (cachedBlob) {
                    objectUrl = URL.createObjectURL(cachedBlob);
                    setSrc(objectUrl);
                    setLoading(false);
                    return;
                }

                // 2. Prevent Duplicate Concurrent Requests
                if (pendingRequests[id]) {
                    await pendingRequests[id];
                    const reCheckBlob = await getCachedBlob(id);
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
                        if (!window._activeCloudName) {
                            const configRes = await fetch('/api/config/active-cloud');
                            const { cloudName } = await configRes.json();
                            window._activeCloudName = cloudName;
                        }
                        const cloudName = window._activeCloudName;

                        const cleanId = id.includes('.') ? id : `${id}.webp`;
                        const cloudUrl = `https://res.cloudinary.com/${cloudName}/${type}/upload/w_800,f_auto,q_auto/${cleanId}`;

                        const response = await fetch(cloudUrl);
                        if (!response.ok) throw new Error("Cloudinary fetch failed");
                        const blob = await response.blob();

                        // 3. Store in Cache (Using Centralized Service)
                        await saveToCache(id, blob);
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
                console.error("SmartImage Sync Error:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchAsset();

        return () => {
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [id, type]);

    if (error) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center text-gray-300 ${className}`}>
                <Icon icon="solar:image-broken-bold" className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            )}
            
            {src && (
                <img 
                    src={src} 
                    alt={alt} 
                    className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
                    loading={priority ? "eager" : "lazy"}
                />
            )}
        </div>
    );
}
