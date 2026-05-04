"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { getAppConfig, updateAppConfig } from '../../actions';
// We use server actions/API routes to fetch usage to keep 'fs' out of the browser

import toast from 'react-hot-toast';

export default function StorageSettings() {
    const [config, setConfig] = useState(null);
    const [usage, setUsage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const cfg = await getAppConfig();
            setConfig(cfg);

            // We need a server action for usage because it uses private keys
            const res = await fetch('/api/cloudinary/usage');
            const usageData = await res.json();
            setUsage(usageData);
        } catch (err) {
            toast.error("Failed to sync storage data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSwitchAccount = async (index) => {
        try {
            await updateAppConfig({ activeCloudinaryIndex: index });
            setConfig({ ...config, activeCloudinaryIndex: index });
            toast.success(`Switched to Account ${index + 1}`);
        } catch (err) {
            toast.error("Switch failed");
        }
    };

    const toggleAutoSwitch = async () => {
        const newValue = !config.isAutoSwitchEnabled;
        try {
            await updateAppConfig({ isAutoSwitchEnabled: newValue });
            setConfig({ ...config, isAutoSwitchEnabled: newValue });
            toast.success(`Auto-switch ${newValue ? 'Enabled' : 'Disabled'}`);
        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary" />
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-primary/30">Scanning Cloud Nodes...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-primary">Storage Hub</h1>
                    <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Cloudinary Multi-Account Management</p>
                </div>
                <button
                    onClick={loadData}
                    disabled={refreshing}
                    className="p-3 bg-white border border-brand-primary/5 rounded-xl text-brand-primary hover:bg-brand-primary/5 transition-all shadow-sm"
                >
                    <Icon icon="solar:restart-bold-duotone" className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Critical Usage Alert - Only shown if any account is over 23GB */}
                {usage.some(acc => acc.credits?.used >= 23) && (
                    <div className="bg-rose-50 border-2 border-rose-100 rounded-[32px] p-6 flex items-center gap-6 animate-pulse">
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <Icon icon="solar:danger-bold" className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">Critical Usage Warning</h4>
                            <p className="text-[11px] text-rose-700 font-bold mt-1">One or more accounts have reached the 23GB safety threshold. The system is actively managing the failover to prevent service interruption.</p>
                        </div>
                    </div>
                )}

                {/* System Status Card */}
                <div className="bg-white rounded-[32px] p-8 border border-brand-primary/5 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand-secondary/10 transition-colors" />

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <h3 className="text-lg font-bold text-brand-primary">Automatic Failover</h3>
                            </div>
                            <p className="text-xs text-brand-primary/60 max-w-md">
                                When enabled, the system will automatically switch to the next account if the current one exceeds 23GB (credits).
                            </p>
                        </div>
                        <button
                            onClick={toggleAutoSwitch}
                            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${config?.isAutoSwitchEnabled
                                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                        >
                            {config?.isAutoSwitchEnabled ? 'System: Active' : 'System: Disabled'}
                        </button>
                    </div>
                </div>

                {/* Account Nodes */}
                <div className="grid grid-cols-1 gap-6">
                    {usage.map((acc, idx) => (
                        <AccountCard
                            key={`${acc.type}-${acc.name}`}
                            acc={acc}
                            idx={idx}
                            isActive={acc.type === 'image' && config?.activeCloudinaryIndex === acc.index}
                            handleSwitchAccount={handleSwitchAccount}
                        />
                    ))}
                </div>

                <div className="p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex items-start gap-6">
                    <Icon icon="solar:info-circle-bold-duotone" className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                        <h5 className="text-xs font-bold text-amber-900 mb-1">Architecture Note</h5>
                        <p className="text-[10px] text-amber-800 leading-relaxed italic">
                            All uploads are synchronized across all nodes. Switching the active node only changes which account serves images to your visitors.
                            This allows you to bypass monthly bandwidth limits without losing any media.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccountCard({ acc, idx, isActive, handleSwitchAccount }) {
    const isCritical = acc.credits?.used >= 23; // Red theme if over safety limit

    return (
        <div
            className={`bg-white rounded-[32px] p-8 border transition-all duration-500 ${isCritical
                    ? 'border-rose-200 bg-rose-50/30 shadow-xl shadow-rose-100'
                    : isActive
                        ? 'border-brand-secondary shadow-xl shadow-brand-secondary/5'
                        : 'border-brand-primary/5 hover:border-brand-primary/10'
                }`}
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isCritical ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' :
                            isActive ? 'bg-brand-secondary/10 text-brand-secondary' :
                                'bg-brand-primary/5 text-brand-primary/20'
                        }`}>
                        <Icon icon={isCritical ? "solar:danger-bold-duotone" : "solar:cloud-storage-bold-duotone"} className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h4 className={`text-lg font-bold ${isCritical ? 'text-rose-900' : 'text-brand-primary'}`}>{acc.name}</h4>
                            {acc.type === 'video' && (
                                <span className="bg-brand-primary text-white text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">Dedicated Video</span>
                            )}
                            {isCritical && (
                                <span className="bg-rose-100 text-rose-600 text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-rose-200">Exhausted</span>
                            )}
                        </div>
                        <p className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>
                             {
                                acc.name === 'dumbddcvh' ? 'divyeshrupareliya.dev' :
                                    acc.name === 'dsyw62773' ? 'divyeshrupareliya150' :
                                        acc.name === 'duifmfnov' ? 'divyeshrupareliya2206' :
                                            acc.name
                            }
                        </p>
                    </div>
                </div>

                <div className="flex-1 max-w-sm w-full space-y-3">
                    <div className="flex justify-between items-end">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isCritical ? 'text-rose-400' : 'text-brand-primary/30'}`}>Credit Usage</span>
                        <span className={`text-xs font-bold ${isCritical ? 'text-rose-600' : 'text-brand-primary'}`}>
                            {Math.abs(acc.credits?.used || 0).toFixed(2)} / {acc.credits?.limit || 25} GB
                        </span>
                    </div>
                    <div
                        className="h-2.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: isCritical ? '#fecdd3' : 'rgba(197, 160, 89, 0.1)' }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${Math.max(0.5, (acc.credits?.used / (acc.credits?.limit || 25)) * 100)}%`,
                                backgroundColor: isCritical ? '#f43f5e' : '#1a4332',
                                transition: 'width 1s ease-in-out'
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isCritical ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full text-rose-600 text-[10px] font-black uppercase tracking-widest">
                            <Icon icon="solar:lock-bold" className="w-4 h-4" />
                            Locked
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-brand-secondary' : 'text-brand-primary/30'}`}>
                                {acc.type === 'video' ? 'Dedicated Pipeline' : (isActive ? 'Serving Assets' : 'Standby Mode')}
                            </span>
                            {acc.type === 'image' && (
                                <button
                                    onClick={() => !isActive && handleSwitchAccount(acc.index)}
                                    disabled={isActive || isCritical}
                                    className={`relative w-14 h-8 rounded-full transition-all duration-500 flex items-center p-1 shadow-inner ${isActive
                                            ? 'bg-brand-secondary'
                                            : 'bg-brand-primary/10 cursor-pointer hover:bg-brand-primary/20'
                                        }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 flex items-center justify-center ${isActive ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    >
                                        {isActive && <Icon icon="lucide:check" className="w-3 h-3 text-brand-secondary" />}
                                    </div>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`mt-12 pt-12 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isCritical ? 'border-rose-100' : 'border-brand-primary/5'}`}>
                <div className="space-y-2">
                    <div className={`flex items-center gap-2 mb-3 ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>
                        <Icon icon="solar:globus-bold-duotone" className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Bandwidth</span>
                    </div>
                    <p className={`text-xl font-bold ${isCritical ? 'text-rose-900' : 'text-brand-primary'}`}>
                        {Math.abs((acc.bandwidth?.used || 0) / (1024 * 1024 * 1024)).toFixed(2)} <span className={`text-xs ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>GB</span>
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isCritical ? 'text-rose-300' : 'text-brand-primary/30'}`}>
                        {acc.bandwidth?.limit > 0 ? `of ${acc.bandwidth.limit / (1024 * 1024 * 1024)} GB Limit` : 'Part of Shared Credits'}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className={`flex items-center gap-2 mb-3 ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>
                        <Icon icon="solar:database-bold-duotone" className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Storage</span>
                    </div>
                    <p className={`text-xl font-bold ${isCritical ? 'text-rose-900' : 'text-brand-primary'}`}>
                        {Math.abs((acc.storage?.used || 0) / (1024 * 1024 * 1024)).toFixed(2)} <span className={`text-xs ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>GB</span>
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isCritical ? 'text-rose-300' : 'text-brand-primary/30'}`}>
                        {acc.storage?.limit > 0 ? `of ${acc.storage.limit / (1024 * 1024 * 1024)} GB Limit` : 'Part of Shared Credits'}
                    </p>
                </div>

                <div className="space-y-2">
                    <div className={`flex items-center gap-2 mb-3 ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>
                        <Icon icon="solar:magic-stick-3-bold-duotone" className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Transformations</span>
                    </div>
                    <p className={`text-xl font-bold ${isCritical ? 'text-rose-900' : 'text-brand-primary'}`}>{(acc.transformations?.used || 0).toLocaleString()}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isCritical ? 'text-rose-300' : 'text-brand-primary/30'}`}>Optimizations applied</p>
                </div>

                <div className="space-y-2">
                    <div className={`flex items-center gap-2 mb-3 ${isCritical ? 'text-rose-400' : 'text-brand-primary/40'}`}>
                        <Icon icon="solar:eye-bold-duotone" className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Impressions</span>
                    </div>
                    <p className={`text-xl font-bold ${isCritical ? 'text-rose-900' : 'text-brand-primary'}`}>{(acc.requests || 0).toLocaleString()}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-tighter ${isCritical ? 'text-rose-300' : 'text-brand-primary/30'}`}>Total asset requests</p>
                </div>
            </div>
        </div>
    );
}
