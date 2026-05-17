"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, getSubCategories, getInnerSubCategories, createProduct } from "../../actions";
import CustomSelect from "@/components/CustomSelect";
import toast from "react-hot-toast";
import { useCloudinary } from "@/hooks/useCloudinary";
import { compressAndResizeImage } from "@/lib/imageProcessor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { roundToTwo } from "@/lib/utils";

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function BulkUploadPage() {
    const router = useRouter();
    const [cats, setCats] = useState([]);
    const [subs, setSubs] = useState([]);
    const [inners, setInners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [config, setConfig] = useState({
        categoryId: "",
        subCategoryId: "",
        innerSubId: null,
        mrp: 0,
        price: 0,
        isBestSeller: false,
        isReadyStock: false,
        showWashCare: false,
        isVisible: false,
        allowToBuy: false,
        details: [],
        description: "",
        wholesalerDescription: "",
    });

    const [queue, setQueue] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState({ total: 0, done: 0 });

    const { uploadToAllAccounts } = useCloudinary();
    const dropzoneRef = useRef(null);

    useEffect(() => {
        loadTaxonomy();
    }, []);

    const loadTaxonomy = async () => {
        try {
            const [cRes, sRes, iRes] = await Promise.all([getCategories(), getSubCategories(), getInnerSubCategories()]);
            setCats(cRes); setSubs(sRes); setInners(iRes);
        } catch (error) {
            toast.error("Failed to load taxonomy");
        } finally {
            setLoading(false);
        }
    };

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;

        if (!config.categoryId || !config.subCategoryId) {
            toast.error("Please select Primary Category and Sub-category before adding images.");
            return;
        }

        const selectedInner = inners.find(i => i.id === config.innerSubId);
        const selectedSub = subs.find(s => s.id === config.subCategoryId);

        let taxonomyPrefix = "";
        if (selectedInner) taxonomyPrefix = selectedInner.name;
        else if (selectedSub) taxonomyPrefix = selectedSub.name;

        toast.loading(`Processing ${files.length} images...`, { id: 'process' });

        const newItems = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // ID = exact original name
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const productId = originalName;

            // Name = Taxonomy + ID
            const generatedName = taxonomyPrefix ? `${taxonomyPrefix} ${productId}` : productId;

            try {
                const processed = await compressAndResizeImage(file, 'product');
                newItems.push({
                    id: Math.random().toString(36).substring(7),
                    originalFile: file,
                    compressedFile: processed.file,
                    preview: processed.preview,
                    productId: productId,
                    name: generatedName,
                    status: 'pending' // pending | uploading | success | error
                });
            } catch (e) {
                console.error("Compression failed for", file.name, e);
                toast.error(`Failed to compress ${file.name}`);
            }
        }

        setQueue(prev => [...prev, ...newItems]);
        toast.success(`Processed ${newItems.length} images successfully.`, { id: 'process' });
        
        if (dropzoneRef.current) dropzoneRef.current.value = "";
    };

    const updateQueueItem = (id, field, value) => {
        setQueue(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeQueueItem = (id) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    };

    const handleUploadBulk = async () => {
        const pendingItems = queue.filter(q => q.status === 'pending' || q.status === 'error');
        if (pendingItems.length === 0) {
            toast.error("No pending items to upload");
            return;
        }

        setIsUploading(true);
        setProgress({ total: pendingItems.length, done: 0 });

        let successCount = 0;

        for (let i = 0; i < queue.length; i++) {
            const item = queue[i];
            if (item.status === 'success') continue;

            updateQueueItem(item.id, 'status', 'uploading');

            try {
                // 1. Upload to Cloudinary
                const cloudRes = await uploadToAllAccounts(item.compressedFile, 'image');
                const public_id = cloudRes.public_id;

                // 2. Prepare Payload
                const payload = {
                    productId: item.productId,
                    name: item.name,
                    slug: slugify(item.name),
                    categoryId: config.categoryId,
                    subCategoryId: config.subCategoryId,
                    innerSubId: config.innerSubId,
                    mrp: roundToTwo(config.mrp),
                    price: roundToTwo(config.price),
                    offerPrice: roundToTwo(config.price), 
                    discountPercent: 0,
                    isBestSeller: config.isBestSeller,
                    isReadyStock: config.isReadyStock,
                    showWashCare: config.showWashCare,
                    isVisible: config.isVisible,
                    allowToBuy: config.allowToBuy,
                    description: config.description,
                    wholesalerDescription: config.wholesalerDescription,
                    details: config.details,
                    images: [public_id],
                    videos: [],
                    variants: [], // Empty defaults
                    unit: "PIECE"
                };

                // 3. Create Product in DB
                await createProduct(payload);

                updateQueueItem(item.id, 'status', 'success');
                successCount++;
                setProgress(prev => ({ ...prev, done: prev.done + 1 }));

            } catch (e) {
                console.error("Upload failed for item", item.name, e);
                updateQueueItem(item.id, 'status', 'error');
                updateQueueItem(item.id, 'errorMsg', e.message || "Upload Failed");
                // Stop the loop if there's a fatal error? Or continue? Usually continue so others can succeed.
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toast.success(`Bulk upload completed! ${successCount} successfully registered.`);
        } else {
            toast.error("Bulk upload failed for all items.");
        }
    };

    const availableSubs = config.categoryId ? subs.filter(s => s.categoryId === config.categoryId) : subs;
    const availableInners = config.subCategoryId ? inners.filter(i => i.subCategoryId === config.subCategoryId) : inners;

    if (loading) {
        return <div className="text-center py-20"><Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" /></div>;
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <style jsx global>{`
                input[type='number']::-webkit-inner-spin-button,
                input[type='number']::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type='number'] { -moz-appearance: textfield; }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                    <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-brand-primary/40 hover:text-brand-primary transition-colors mb-4">
                        <Icon icon="lucide:arrow-left" className="w-3 h-3" /> Back to Master Catalog
                    </Link>
                    <h1 className="text-4xl font-serif font-bold text-brand-primary flex items-center gap-4">
                        Bulk Upload
                        <span className="bg-brand-secondary/10 text-brand-secondary text-[10px] px-3 py-1 rounded-full tracking-widest uppercase font-black translate-y-[-2px]">Beta</span>
                    </h1>
                    <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Mass Product Ingestion Engine</p>
                </div>
                {queue.length > 0 && (
                    <button 
                        onClick={handleUploadBulk} 
                        disabled={isUploading}
                        className={`px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl whitespace-nowrap flex items-center gap-2 ${isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-brand-primary text-white hover:shadow-2xl'}`}
                    >
                        {isUploading ? <Icon icon="line-md:loading-loop" className="w-4 h-4" /> : <Icon icon="solar:cloud-upload-bold" className="w-4 h-4" />}
                        {isUploading ? `Uploading... (${progress.done}/${progress.total})` : `Commit & Upload ${queue.filter(q => q.status === 'pending' || q.status === 'error').length} Items`}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Global Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Taxonomy */}
                    <div className="p-7 bg-white rounded-[32px] border border-brand-primary/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Icon icon="solar:layers-bold-duotone" className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary">1. Global Taxonomy</h4>
                                <p className="text-[8px] uppercase tracking-widest text-brand-primary/40 mt-0.5">Required for Naming</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CustomSelect
                                placeholder="Select Primary Category"
                                options={cats.map(c => ({ value: c.id, label: c.name }))}
                                value={config.categoryId}
                                onChange={val => setConfig({ ...config, categoryId: val, subCategoryId: '', innerSubId: null })}
                                isSearchable={true}
                            />
                            <CustomSelect
                                placeholder="Select Sub-category"
                                options={availableSubs.map(c => ({ value: c.id, label: c.name }))}
                                value={config.subCategoryId}
                                onChange={val => setConfig({ ...config, subCategoryId: val, innerSubId: null })}
                                isSearchable={true}
                                disabled={!config.categoryId}
                            />
                            <CustomSelect
                                placeholder="Select Inner Variant (Optional)"
                                options={availableInners.map(c => ({ value: c.id, label: c.name }))}
                                value={config.innerSubId || ""}
                                onChange={val => setConfig({ ...config, innerSubId: val })}
                                isSearchable={true}
                                disabled={!config.subCategoryId || availableInners.length === 0}
                            />
                        </div>
                    </div>

                    {/* Economics */}
                    <div className="p-7 bg-white rounded-[32px] border border-brand-primary/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Icon icon="solar:wallet-money-bold-duotone" className="w-5 h-5" />
                            </div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary">2. Global Economics</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-primary/40 ml-1">Default MRP</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-sm text-brand-primary/30">₹</span>
                                    <input type="number" min="0" value={config.mrp} onChange={e => setConfig({ ...config, mrp: e.target.value })} className="w-full p-4 pl-8 border border-brand-primary/5 rounded-2xl bg-brand-primary/5 font-serif font-bold text-sm outline-none focus:border-brand-primary/20 transition-all" placeholder="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-primary/40 ml-1">Default Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-sm text-brand-primary/30">₹</span>
                                    <input type="number" min="0" value={config.price} onChange={e => setConfig({ ...config, price: e.target.value })} className="w-full p-4 pl-8 border border-brand-primary/5 rounded-2xl bg-brand-primary/5 font-serif font-bold text-sm outline-none focus:border-brand-primary/20 transition-all" placeholder="0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="p-7 bg-white rounded-[32px] border border-brand-primary/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Icon icon="solar:eye-bold-duotone" className="w-5 h-5" />
                            </div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary">3. Global Toggles</h4>
                        </div>
                        <div className="space-y-2">
                            {[
                                { id: 'isBestSeller', label: 'Best Seller', icon: 'solar:star-bold' },
                                { id: 'isReadyStock', label: 'Ready Stock', icon: 'solar:box-bold' },
                                { id: 'showWashCare', label: 'Wash Care', icon: 'ic:twotone-wash' },
                                { id: 'isVisible', label: 'Show on Website', icon: 'solar:eye-bold' },
                                { id: 'allowToBuy', label: 'Allow to Buy', icon: 'solar:cart-large-bold' },
                            ].map(item => (
                                <label key={item.id} className="flex items-center justify-between p-3 hover:bg-brand-primary/5 rounded-xl cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Icon icon={item.icon} className={`w-4 h-4 ${config[item.id] ? 'text-brand-primary' : 'text-brand-primary/30'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${config[item.id] ? 'text-brand-primary' : 'text-brand-primary/40'}`}>{item.label}</span>
                                    </div>
                                    <input type="checkbox" checked={config[item.id]} onChange={e => setConfig({ ...config, [item.id]: e.target.checked })} className="sr-only peer" />
                                    <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-[16px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-primary relative"></div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="p-7 bg-white rounded-[32px] border border-brand-primary/5 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary">
                                <Icon icon="solar:medal-star-bold-duotone" className="w-5 h-5" />
                            </div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary">4. Specifications</h4>
                        </div>
                        <div className="space-y-3">
                            {["Fabric", "Embroidery", "Work", "Included"].map(label => {
                                const detail = config.details.find(d => d.label === label);
                                return (
                                    <div key={label} className="bg-brand-primary/5 p-3 rounded-xl">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary/40 mb-1 block ml-1">{label}</span>
                                        <input
                                            type="text"
                                            value={detail?.value || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                let newDetails = [...config.details];
                                                const idx = newDetails.findIndex(d => d.label === label);
                                                if (idx > -1) {
                                                    if (val) newDetails[idx].value = val;
                                                    else newDetails.splice(idx, 1);
                                                } else if (val) {
                                                    newDetails.push({ label, value: val });
                                                }
                                                setConfig({ ...config, details: newDetails });
                                            }}
                                            placeholder={`Leave blank or define...`}
                                            className="w-full bg-transparent border-none outline-none font-serif font-bold text-[13px] text-brand-primary placeholder:text-brand-primary/20"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Processing & Review Grid */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-8 bg-brand-accent/20 rounded-[40px] border border-brand-primary/10 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center justify-center text-center py-10">
                            <div className="w-20 h-20 bg-white rounded-[28px] shadow-lg flex items-center justify-center mb-6 text-brand-primary">
                                <Icon icon="solar:gallery-bold-duotone" className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-2">Drop Masterpieces Here</h2>
                            <p className="text-[11px] font-black tracking-widest uppercase text-brand-primary/40 mb-8 max-w-sm">
                                Select taxonomy first. Original filenames will become Product IDs. Names will be auto-generated.
                            </p>
                            <button onClick={() => dropzoneRef.current?.click()} className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-xl shadow-brand-primary/20">
                                Select Multiple Images
                            </button>
                            <input ref={dropzoneRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(Array.from(e.target.files))} />
                        </div>
                    </div>

                    {queue.length > 0 && (
                        <div className="bg-white rounded-[40px] border border-brand-primary/10 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-brand-primary">Review Grid</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mt-1">Edit titles inline before uploading</p>
                                </div>
                                <div className="text-[11px] font-black tracking-widest uppercase bg-brand-primary/5 text-brand-primary px-4 py-2 rounded-xl">
                                    {queue.length} Items
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence>
                                    {queue.map((item, i) => (
                                        <motion.div 
                                            key={item.id} 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`flex gap-5 p-4 rounded-3xl border transition-all items-center ${
                                                item.status === 'success' ? 'bg-emerald-50/50 border-emerald-100' :
                                                item.status === 'error' ? 'bg-red-50/50 border-red-100' :
                                                item.status === 'uploading' ? 'bg-blue-50/50 border-blue-100' :
                                                'bg-white border-brand-primary/5 hover:border-brand-primary/20 shadow-sm'
                                            }`}
                                        >
                                            <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-black/5 relative bg-gray-100">
                                                <img src={item.preview} className="w-full h-full object-cover" />
                                                {item.status === 'success' && (
                                                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                        <Icon icon="lucide:check-circle" className="text-emerald-500 w-8 h-8 bg-white rounded-full" />
                                                    </div>
                                                )}
                                                {item.status === 'uploading' && (
                                                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                        <Icon icon="line-md:loading-loop" className="text-blue-500 w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 space-y-3 min-w-0">
                                                <div className="flex gap-4">
                                                    <div className="w-1/3">
                                                        <label className="text-[8px] uppercase tracking-widest font-black text-brand-primary/30 ml-1 mb-1 block">Product ID (From Filename)</label>
                                                        <input 
                                                            type="text" 
                                                            value={item.productId} 
                                                            onChange={e => updateQueueItem(item.id, 'productId', e.target.value)}
                                                            disabled={item.status !== 'pending' && item.status !== 'error'}
                                                            className="w-full bg-brand-primary/5 px-3 py-2.5 rounded-xl text-[12px] font-bold text-brand-primary outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[8px] uppercase tracking-widest font-black text-brand-secondary/50 ml-1 mb-1 block">Display Name (Auto-Generated)</label>
                                                        <input 
                                                            type="text" 
                                                            value={item.name} 
                                                            onChange={e => updateQueueItem(item.id, 'name', e.target.value)}
                                                            disabled={item.status !== 'pending' && item.status !== 'error'}
                                                            className="w-full bg-white border border-brand-primary/10 px-3 py-2.5 rounded-xl text-[13px] font-serif font-bold text-brand-primary outline-none focus:border-brand-primary/40 focus:shadow-sm transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {item.status === 'error' && (
                                                    <p className="text-[10px] text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-lg inline-block">Error: {item.errorMsg}</p>
                                                )}
                                            </div>

                                            {(item.status === 'pending' || item.status === 'error') && (
                                                <button 
                                                    onClick={() => removeQueueItem(item.id)}
                                                    className="w-10 h-10 shrink-0 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Remove from queue"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
