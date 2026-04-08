"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getSubCategories, getInnerSubCategories } from "../actions";
import CustomSelect from "@/components/CustomSelect";
import toast from "react-hot-toast";


export default function ProductsPage() {
    const [data, setData] = useState([]);
    const [cats, setCats] = useState([]);
    const [subs, setSubs] = useState([]);
    const [inners, setInners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [step, setStep] = useState(1);
    const [offerType, setOfferType] = useState("price"); // price | percentage
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const initForm = { productId: "", name: "", slug: "", description: "", mrp: 0, price: 0, offerPrice: 0, discountPercent: 0, categoryId: "", subCategoryId: "", innerSubId: null, images: [], videos: [], isBestSeller: false, isOfferProduct: false, isReadyStock: false, showSizeGuide: false, showWashCare: false, details: [] };
    const [form, setForm] = useState(initForm);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [isDraggingVideo, setIsDraggingVideo] = useState(false);
    const [pendingUploads, setPendingUploads] = useState([]); // [{id, previewUrl, type}]

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [pRes, cRes, sRes, iRes] = await Promise.all([getProducts(), getCategories(), getSubCategories(), getInnerSubCategories()]);
        setData(pRes); setCats(cRes); setSubs(sRes); setInners(iRes);
        setLoading(false);
    };

    const handleUpload = async (e, type, droppedFiles = null) => {
        const files = droppedFiles || Array.from(e.target.files);
        if (!files || files.length === 0) return;

        if (type === 'image') setUploadingImage(true);
        else setUploadingVideo(true);

        const newPending = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            previewUrl: URL.createObjectURL(file),
            type: type
        }));

        setPendingUploads(prev => [...prev, ...newPending]);

        try {
            await Promise.all(files.map(async (file, idx) => {
                try {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const dt = await res.json();

                    if (dt.url) {
                        setForm(prev => ({
                            ...prev,
                            [type === 'image' ? 'images' : 'videos']: [...prev[type === 'image' ? 'images' : 'videos'], dt.url]
                        }));
                    }
                } catch (err) {
                    toast.error(`One ${type} failed to upload`);
                } finally {
                    setPendingUploads(prev => prev.filter(p => p.id !== newPending[idx].id));
                }
            }));

            toast.success("Media Uploaded Successfully");
        } catch (err) {
            toast.error("Media batch failed. System check required.");
        } finally {
            if (type === 'image') setUploadingImage(false);
            else setUploadingVideo(false);
        }
    };


    const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const handleSubmit = async () => {
        if (step < 3) {
            setStep(s => Math.min(s + 1, 3));
            return;
        }
        if (form.images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }
        if (!form.categoryId || !form.subCategoryId) {
            toast.error("Category and Sub-category are required");
            setStep(1);
            return;
        }

        if (form.isOfferProduct && parseFloat(form.offerPrice) > parseFloat(form.mrp)) {
            toast.error("Discount Price cannot exceed MRP");
            setStep(2);
            return;
        }

        if (parseFloat(form.price) > parseFloat(form.mrp)) {
            toast.error("Sale Price cannot exceed MRP");
            setStep(2);
            return;
        }

        const payload = {
            ...form,
            mrp: parseFloat(form.mrp),
            price: parseFloat(form.price),
            offerPrice: parseFloat(form.offerPrice),
            discountPercent: parseInt(form.discountPercent),
            showSizeGuide: !!form.showSizeGuide,
            showWashCare: !!form.showWashCare,
            isReadyStock: !!form.isReadyStock
        };
        if (!payload.innerSubId) payload.innerSubId = null;

        try {
            if (editingId) {
                await updateProduct(editingId, payload);
                toast.success("Masterpiece Refined");
            } else {
                await createProduct(payload);
                toast.success("New Masterpiece Injected");
            }
            setIsOpen(false);
            loadData();
        } catch (err) {
            toast.error(err.message || "Failed to save masterpiece. Check connection.");
        }
    };

    // Filter subs based on selected category
    const availableSubs = form.categoryId ? subs.filter(s => s.categoryId === form.categoryId) : subs;
    const availableInners = form.subCategoryId ? inners.filter(i => i.subCategoryId === form.subCategoryId) : inners;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-primary">Master Catalog</h1>
                    <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">Administer Inventory Flow</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative group w-full sm:w-80">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
                        />
                    </div>
                    <button onClick={() => { setEditingId(null); setForm(initForm); setIsOpen(true); setStep(1); setOfferType("price"); }} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl whitespace-nowrap flex items-center gap-2">
                        <Icon icon="lucide:plus" className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {loading ? <div className="text-center py-20"><Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" /></div> : (
                <div className="bg-white rounded-[32px] shadow-sm border border-brand-primary/5">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest">
                            <tr>
                                <th className="p-5 w-16 rounded-tl-[32px]">Media</th>
                                <th className="p-5">Name & Taxonomy</th>
                                <th className="p-5">Pricing</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right rounded-tr-[32px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-primary/5">
                            {data.filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (p.productId && p.productId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                p.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.subCategory?.name.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(p => (
                                <tr key={p.id} className="hover:bg-brand-primary/[0.02] transition-colors">
                                    <td className="p-5">
                                        <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden border border-black/5">
                                            {p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Icon icon="lucide:image" className="opacity-20" /></div>}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="font-bold text-brand-primary truncate max-w-[200px]">{p.name}</p>
                                        <p className="text-[10px] text-brand-secondary tracking-widest uppercase font-bold mt-1">
                                            <span className="bg-brand-primary/10 px-2 py-0.5 rounded text-brand-primary mr-2">{p.productId || 'NO-ID'}</span>
                                            {p.category?.name} {p.subCategory ? `› ${p.subCategory.name}` : ''}
                                        </p>
                                    </td>
                                    <td className="p-5">
                                        {p.isOfferProduct && p.offerPrice ? (
                                            <>
                                                <p className="font-bold text-red-600 font-serif text-lg">₹{p.offerPrice}</p>
                                                <p className="text-[10px] line-through text-gray-400">₹{p.price}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-bold text-black font-serif">₹{p.price}</p>
                                                {p.mrp > p.price && <p className="text-[10px] line-through text-gray-400">₹{p.mrp}</p>}
                                            </>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            {p.isBestSeller && <span className="bg-yellow-100 text-yellow-800 text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Best</span>}
                                            {p.isOfferProduct && <span className="bg-red-100 text-red-800 text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Offer</span>}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => {
                                            setEditingId(p.id);
                                            setForm({
                                                ...p,
                                                innerSubId: p.innerSubId || "",
                                                details: Array.isArray(p.details) ? p.details : [],
                                                showSizeGuide: !!p.showSizeGuide,
                                                showWashCare: !!p.showWashCare,
                                                isReadyStock: !!p.isReadyStock
                                            });
                                            setOfferType(p.discountPercent > 0 ? "percentage" : "price");
                                            setStep(1);
                                            setIsOpen(true);
                                        }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Icon icon="lucide:edit-2" /></button>
                                        <button onClick={() => { setItemToDelete(p); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Icon icon="lucide:trash-2" /></button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                    <div className="bg-white max-w-4xl w-full rounded-[40px] p-6 lg:p-10 shadow-2xl relative my-auto">
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Icon icon="lucide:x" /></button>
                        <div className="mb-5 block">
                            <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Modify' : 'Inject'} Masterpiece</h2>
                            <div className="flex gap-2 mt-4">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`h-1.5 grow rounded-full transition-all duration-500 ${step >= s ? 'bg-brand-secondary' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[8px] uppercase tracking-[0.2em] font-bold text-brand-primary/40">
                                <span>Identity</span>
                                <span>Economics</span>
                                <span>Assets</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div className="p-8 bg-brand-accent/40 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-brand-primary/60">Primary Identifiers</h4>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-bold block mb-1.5 ml-1">Product ID / SKU</label>
                                                    <input type="text" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value.toUpperCase() })} className="w-full p-4 border border-black/10 rounded-2xl bg-white font-mono text-[11px] focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none" placeholder="e.g. VG A-517" required />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-bold block mb-1.5 ml-1">Product Name</label>
                                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="w-full p-4 border border-black/10 rounded-2xl bg-white focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none" placeholder="Enter Product Name" required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-8 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-brand-primary/60">Product Placement</h4>
                                            <div className="space-y-3">
                                                <CustomSelect
                                                    placeholder="1. Select Category"
                                                    options={cats.map(c => ({ value: c.id, label: c.name }))}
                                                    value={form.categoryId}
                                                    onChange={val => setForm({ ...form, categoryId: val, subCategoryId: '', innerSubId: null })}
                                                    isSearchable={true}
                                                    className="mb-2"
                                                // theme="dark"
                                                />
                                                <CustomSelect
                                                    placeholder="2. Select Sub-category"
                                                    options={availableSubs.map(c => ({ value: c.id, label: c.name }))}
                                                    value={form.subCategoryId}
                                                    onChange={val => setForm({ ...form, subCategoryId: val, innerSubId: null })}
                                                    isSearchable={true}
                                                    disabled={!form.categoryId}
                                                    className="mb-2"
                                                // theme="dark"
                                                />
                                                <CustomSelect
                                                    placeholder="3. Optional Inner Filter"
                                                    options={availableInners.map(c => ({ value: c.id, label: c.name }))}
                                                    value={form.innerSubId || ""}
                                                    onChange={val => setForm({ ...form, innerSubId: val })}
                                                    isSearchable={true}
                                                    disabled={!form.subCategoryId || availableInners.length === 0}
                                                // theme="dark"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    {/* Financial Card */}
                                    <div className="md:col-span-5 space-y-6">
                                        <div className="bg-brand-accent/20 rounded-[32px] p-8 border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                                                    <Icon icon="solar:wallet-money-bold-duotone" className="w-5 h-5 text-brand-secondary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-primary">Financials</h4>
                                                    <p className="text-[8px] text-brand-primary/40 uppercase font-bold tracking-widest">Configure value metrics</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-primary/40 ml-1">MRP</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/30 font-serif text-sm">₹</span>
                                                            <input type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} className="w-full p-4 pl-10 border border-brand-primary/5 rounded-2xl bg-brand-primary/2 font-serif font-bold text-brand-primary transition-all focus:ring-4 focus:ring-brand-secondary/5 outline-none" placeholder="0" required />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-secondary ml-1">Sell Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40 font-serif text-sm">₹</span>
                                                            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value, offerPrice: form.isOfferProduct && offerType === 'percentage' ? (e.target.value * (1 - form.discountPercent / 100)).toFixed(2) : form.offerPrice })} className="w-full p-4 pl-10 border border-brand-secondary/20 rounded-2xl bg-brand-secondary/3 font-serif font-bold text-brand-secondary transition-all focus:ring-4 focus:ring-brand-secondary/10 outline-none" placeholder="0" required />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`p-6 rounded-[24px] border transition-all duration-500 ${form.isOfferProduct ? 'bg-brand-primary/5 border-brand-primary/10 shadow-inner' : 'bg-brand-primary/2 border-brand-primary/5'}`}>
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.isOfferProduct ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                                <Icon icon="solar:tag-bold" className="w-5 h-5" />
                                                            </div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${form.isOfferProduct ? 'text-brand-primary' : 'text-brand-primary/40'}`}>Discount Offer</span>
                                                        </div>
                                                        <input type="checkbox" checked={form.isOfferProduct} onChange={e => setForm({ ...form, isOfferProduct: e.target.checked })} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary relative shadow-inner"></div>
                                                    </label>

                                                    {form.isOfferProduct && (
                                                        <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500 mt-4">
                                                            <div className="flex p-1 bg-white/50 backdrop-blur rounded-xl border border-black/5">
                                                                <button type="button" onClick={() => setOfferType("price")} className={`grow py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${offerType === 'price' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/40 hover:bg-black/5'}`}>Price</button>
                                                                <button type="button" onClick={() => setOfferType("percentage")} className={`grow py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${offerType === 'percentage' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-primary/40 hover:bg-black/5'}`}>Percentage</button>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 items-end">
                                                                {offerType === 'price' ? (
                                                                    <div className="col-span-2 space-y-2">
                                                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-primary/60 ml-1">Discount Price</label>
                                                                        <input type="number" value={form.offerPrice} onChange={e => setForm({ ...form, offerPrice: e.target.value })} className="w-full p-4 border border-brand-primary/10 rounded-2xl bg-white font-serif font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-xl" required />
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] uppercase tracking-widest font-bold text-brand-primary/60 ml-1">Discount %</label>
                                                                            <input type="number" value={form.discountPercent} onChange={e => {
                                                                                const pct = e.target.value;
                                                                                const op = (form.price * (1 - pct / 100)).toFixed(2);
                                                                                setForm({ ...form, discountPercent: pct, offerPrice: op });
                                                                            }} className="w-full p-4 border border-brand-primary/10 rounded-2xl bg-white font-serif font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-xl" required />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400 ml-1">Discount Price</label>
                                                                            <div className="w-full p-4 border border-black/5 rounded-2xl bg-white/50 font-serif font-bold text-brand-primary opacity-50 flex items-center text-xl">₹{form.offerPrice}</div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
                                                    {[
                                                        { id: 'isBestSeller', label: 'Best Seller', icon: 'solar:star-bold' },
                                                        { id: 'isReadyStock', label: 'Ready Stock', icon: 'solar:box-bold' },
                                                        { id: 'showSizeGuide', label: 'Size Guide', icon: 'solar:ruler-bold' },
                                                        { id: 'showWashCare', label: 'Wash Care', icon: 'ic:twotone-wash' }
                                                    ].map((item) => (
                                                        <label
                                                            key={item.id}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer border transition-all duration-300 ${form[item.id]
                                                                ? 'bg-brand-primary border-brand-primary shadow-lg shadow-brand-primary/20 -translate-y-px'
                                                                : 'bg-white border-brand-primary/10 hover:border-brand-primary/30'
                                                                }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={form[item.id]}
                                                                onChange={e => setForm({ ...form, [item.id]: e.target.checked })}
                                                                className="sr-only"
                                                            />
                                                            <Icon
                                                                icon={item.icon}
                                                                className={`w-2.5 h-2.5 ${form[item.id] ? 'text-brand-secondary' : 'text-brand-primary/30'}`}
                                                            />
                                                            <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${form[item.id] ? 'text-white' : 'text-brand-primary/40'
                                                                }`}>
                                                                {item.label}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specs & Tags Card */}
                                    <div className="md:col-span-7 space-y-6">
                                        <div className="bg-brand-accent/20 rounded-[32px] p-8 border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)] min-h-[400px] flex flex-col">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary">
                                                    <Icon icon="solar:medal-star-bold-duotone" className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-primary">Characteristics</h4>
                                                    <p className="text-[8px] text-brand-primary/40 uppercase font-bold tracking-widest">Masterpiece DNA & Tags</p>
                                                </div>
                                            </div>

                                            <div className="grow space-y-4">
                                                <div className="space-y-4">
                                                    {["Fabric", "Embroidery", "Work", "Included"].map((label) => {
                                                        const detail = form.details.find(d => d.label === label);
                                                        return (
                                                            <div key={label} className="flex gap-3 items-center group bg-brand-primary/1 p-2 rounded-2xl hover:bg-brand-primary/3 transition-all border border-transparent hover:border-brand-primary/5">
                                                                <div className="w-[30%] shrink-0 pl-4">
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">{label}</span>
                                                                </div>
                                                                <div className="grow relative">
                                                                    <input
                                                                        type="text"
                                                                        value={detail?.value || ""}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            let newDetails = [...form.details];
                                                                            const idx = newDetails.findIndex(d => d.label === label);
                                                                            if (idx > -1) {
                                                                                if (val) newDetails[idx].value = val;
                                                                                else newDetails.splice(idx, 1);
                                                                            } else if (val) {
                                                                                newDetails.push({ label, value: val });
                                                                            }
                                                                            setForm({ ...form, details: newDetails });
                                                                        }}
                                                                        placeholder={`Enter ${label}`}
                                                                        className="w-full p-3 border border-brand-primary/10 rounded-xl bg-white text-[10px] font-bold text-brand-primary outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold">Rich Description (Optional)</label>
                                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-4 border border-black/10 rounded-2xl bg-brand-accent/20 mt-1 h-32 lg:h-48 resize-none shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]" placeholder="Tell the story of this divine creation..." />
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-[10px] uppercase tracking-widest font-bold block mb-2">Cloudinary Media Payload</label>
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                                            onDragLeave={() => setIsDraggingImage(false)}
                                            onDrop={(e) => { e.preventDefault(); setIsDraggingImage(false); handleUpload(null, 'image', Array.from(e.dataTransfer.files)); }}
                                            className={`grid grid-cols-4 gap-3 p-2 rounded-3xl border-2 border-dashed transition-all ${isDraggingImage ? 'border-brand-secondary bg-brand-secondary/5 rotate-1' : 'border-transparent'}`}
                                        >
                                            {form.images.map((img, i) => <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-black/5 relative group shadow-sm"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                                            {pendingUploads.filter(p => p.type === 'image').map(p => (
                                                <div key={p.id} className="aspect-square rounded-2xl overflow-hidden border border-brand-secondary/20 relative group shadow-sm opacity-60">
                                                    <img src={p.previewUrl} className="w-full h-full object-cover grayscale" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                                                        <Icon icon="line-md:loading-loop" className="w-6 h-6 text-brand-secondary" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative hover:bg-gray-50 cursor-pointer transition-all ${isDraggingImage ? 'border-brand-secondary' : 'border-gray-200'}`}>
                                                {uploadingImage ? <Icon icon="line-md:loading-loop" className="text-brand-secondary w-6 h-6" /> : <><Icon icon="lucide:image-plus" className={isDraggingImage ? 'text-brand-secondary' : 'text-gray-400'} /><span className="text-[7px] font-bold uppercase mt-1 text-gray-300">Add Image</span></>}
                                                <input type="file" multiple disabled={uploadingImage} onChange={(e) => handleUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            </div>
                                        </div>

                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                                            onDragLeave={() => setIsDraggingVideo(false)}
                                            onDrop={(e) => { e.preventDefault(); setIsDraggingVideo(false); handleUpload(null, 'video', Array.from(e.dataTransfer.files)); }}
                                            className={`flex gap-3 overflow-x-auto pt-2 no-scrollbar p-2 rounded-3xl border-2 border-dashed transition-all ${isDraggingVideo ? 'border-brand-secondary bg-brand-secondary/5 rotate-1' : 'border-transparent'}`}
                                        >
                                            {form.videos.map((vid, i) => <div key={i} className="w-32 h-20 shrink-0 rounded-2xl overflow-hidden border bg-black relative group"><video src={vid} className="w-full h-full object-cover" /><button type="button" onClick={() => setForm({ ...form, videos: form.videos.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                                            {pendingUploads.filter(p => p.type === 'video').map(p => (
                                                <div key={p.id} className="w-32 h-20 shrink-0 rounded-2xl overflow-hidden border bg-black relative shadow-sm opacity-60">
                                                    <video src={p.previewUrl} className="w-full h-full object-cover grayscale" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                        <Icon icon="line-md:loading-loop" className="w-6 h-6 text-brand-secondary" />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className={`w-32 h-20 shrink-0 rounded-2xl border-2 border-dashed flex items-center justify-center relative hover:bg-gray-50 cursor-pointer transition-all ${isDraggingVideo ? 'border-brand-secondary' : 'border-gray-200'}`}>
                                                {uploadingVideo ? <Icon icon="line-md:loading-loop" /> : <><Icon icon="lucide:video" className={isDraggingVideo ? 'text-brand-secondary' : 'text-gray-400 mr-2 w-4 h-4'} /><span className={`text-[9px] font-bold uppercase ${isDraggingVideo ? 'text-brand-secondary' : 'text-gray-400'}`}>Add Video</span></>}
                                                <input type="file" multiple disabled={uploadingVideo} onChange={(e) => handleUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="col-span-1 md:col-span-2 pt-8 border-t border-black/5 flex justify-between items-center gap-4">
                                <button type="button" onClick={() => setIsOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors cursor-pointer">Terminate Process</button>

                                <div className="flex gap-4">
                                    {step > 1 && (
                                        <button type="button" onClick={() => setStep(s => s - 1)} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-all text-[10px] flex items-center gap-2"> <Icon icon="lucide:arrow-left" className="w-4 h-4" /> Back</button>
                                    )}

                                    {step < 3 ? (
                                        <button type="button" onClick={() => setStep(s => s + 1)} className="px-10 py-4 lg:px-14 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-[10px] flex items-center gap-2">
                                            Next <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button type="button" onClick={handleSubmit} disabled={uploadingImage || uploadingVideo} className="px-10 py-4 lg:px-14 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-[10px] flex items-center gap-2">
                                            <Icon icon="lucide:save" className="w-4 h-4" /> Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white max-w-sm w-full rounded-[32px] p-8 shadow-2xl text-center border border-black/5"
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-2">Remove Masterpiece?</h3>
                        <p className="text-[10px] text-brand-primary/40 uppercase font-bold tracking-[0.2em] mb-8 leading-relaxed">
                            "{itemToDelete?.name}" will be permanently removed from the catalog.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="grow py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-brand-primary hover:bg-gray-50 transition-all border border-black/20 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await deleteProduct(itemToDelete.id);
                                    toast.success("Masterpiece Removed");
                                    setIsDeleteModalOpen(false);
                                    loadData();
                                }}
                                className="grow py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
