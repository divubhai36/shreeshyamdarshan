"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, Reorder } from "framer-motion";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getSubCategories, getInnerSubCategories } from "../actions";
import CustomSelect from "@/components/CustomSelect";
import toast from "react-hot-toast";
import { roundToTwo } from "@/lib/utils";

import { useCloudinary } from "@/hooks/useCloudinary";
import { compressAndResizeImage } from "@/lib/imageProcessor";
import { deleteFromAllAccounts } from "@/lib/cloudinary";

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

    const { uploadToAllAccounts, uploading: isCloudSyncing } = useCloudinary();
    const initForm = { productId: "", name: "", slug: "", description: "", wholesalerDescription: "", mrp: 0, price: 0, offerPrice: 0, discountPercent: 0, categoryId: "", subCategoryId: "", innerSubId: null, images: [], videos: [], isBestSeller: false, isOfferProduct: false, isReadyStock: false, showWashCare: false, allowToBuy: true, details: [], variants: [], unit: "PIECE", isVisible: true };
    const [form, setForm] = useState(initForm);
    const [errors, setErrors] = useState({});

    // States for "Upload on Submit"
    const [selectedImages, setSelectedImages] = useState([]); // { file, preview }
    const [pendingVideos, setPendingVideos] = useState([]); // { file, preview }

    const [isSaving, setIsSaving] = useState(false);
    const [deletedMedia, setDeletedMedia] = useState([]); // Track IDs to delete from Cloudinary on save

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [pRes, cRes, sRes, iRes] = await Promise.all([getProducts(), getCategories(), getSubCategories(), getInnerSubCategories()]);
        setData(pRes); setCats(cRes); setSubs(sRes); setInners(iRes);
        setLoading(false);
    };

    const handleUpload = async (e, type, droppedFiles = null) => {
        let files = droppedFiles || Array.from(e.target.files);
        if (!files || files.length === 0) return;

        if (type === 'video') {
            // 5MB Limit check
            const maxSize = 5 * 1024 * 1024;
            const oversized = files.find(f => f.size > maxSize);
            if (oversized) {
                toast.error(`"${oversized.name}" is too large! Max 5MB allowed.`);
                return;
            }

            const currentCount = form.videos.length + pendingVideos.length;
            const remaining = 5 - currentCount;
            if (remaining <= 0) {
                toast.error("Video limit reached (Max 5)");
                return;
            }
            const newVideos = files.slice(0, remaining).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setPendingVideos(prev => [...prev, ...newVideos]);
            return;
        }

        const currentCount = form.images.length + selectedImages.length;
        const remaining = 10 - currentCount;

        if (remaining <= 0) {
            toast.error("Maximum 10 images allowed per product.");
            return;
        }

        const filesToProcess = files.slice(0, remaining);

        // toast.loading("Processing Image...", { id: 'process' });
        try {
            const processed = await Promise.all(filesToProcess.map(f => compressAndResizeImage(f, 'product')));
            setSelectedImages(prev => [...prev, ...processed]);
            // toast.success(`${processed.length} Images Prepped for Sync`, { id: 'process' });
        } catch (err) {
            toast.error("Image optimization failed", { id: 'process' });
        }
    };

    const handleToggleVisibility = async (p) => {
        // Optimistic Update: Change UI instantly
        const previousData = [...data];
        setData(prev => prev.map(item =>
            item.id === p.id ? { ...item, isVisible: !item.isVisible } : item
        ));

        try {
            await updateProduct(p.id, { ...p, isVisible: !p.isVisible });
            toast.success(`Product ${!p.isVisible ? 'Visible' : 'Hidden'}`);
        } catch (err) {
            // Revert state if API fails
            setData(previousData);
            toast.error("Failed to sync visibility. Reverted status.");
        }
    };


    const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const validateStep = (s) => {
        let newErrors = {};
        if (s === 1) {
            if (!form.productId) newErrors.productId = "Product ID / SKU is required";
            if (!form.name) newErrors.name = "Product Display Name is required";
            if (!form.categoryId) newErrors.categoryId = "Primary Category is required";
            if (!form.subCategoryId) newErrors.subCategoryId = "Sub-category is required";
        }

        if (s === 2) {
            const mrp = parseFloat(form.mrp) || 0;
            const price = parseFloat(form.price) || 0;
            if (mrp <= 0) newErrors.mrp = "MRP must be positive";
            if (price <= 0) newErrors.price = "Sale Price must be positive";
            if (price > mrp) newErrors.price = "Sale Price cannot exceed MRP";

            if (form.isOfferProduct) {
                const discount = parseFloat(form.discountPercent) || 0;
                if (discount < 0 || discount > 100) {
                    newErrors.discountPercent = "Discount must be between 0 and 100";
                }
            }

            if (form.variants.length > 0) {
                const vErrs = form.variants.map(v => ({
                    name: !v.name ? "Required" : "",
                    price: (!v.price || parseFloat(v.price) <= 0) ? "Required" : ""
                }));
                if (vErrs.some(e => e.name || e.price)) {
                    newErrors.variants = vErrs;
                }
            }
        }

        if (s === 4) {
            if (form.images.length === 0 && selectedImages.length === 0) {
                newErrors.images = "At least one visual masterpiece (image) is required";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErr = Object.values(newErrors)[0];
            toast.error(typeof firstErr === 'string' ? firstErr : "Please check required fields");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;

        if (!editingId && step < 4) {
            setStep(s => s + 1);
            return;
        }

        let currentForm = { ...form };

        try {
            setIsSaving(true);
            const itemsToDelete = [...deletedMedia]; // Copy before state clear

            // 1. Sync Images to All Nodes
            if (selectedImages.length > 0) {
                toast.loading(`Uploading...`, { id: 'save' });
                const uploadedIds = [];
                for (const item of selectedImages) {
                    const res = await uploadToAllAccounts(item.file);
                    uploadedIds.push(res.public_id);
                }
                currentForm.images = [...currentForm.images, ...uploadedIds];
            }

            // 2. Sync Videos to All Nodes
            if (pendingVideos.length > 0) {
                toast.loading(`Uploading...`, { id: 'save' });
                const uploadedIds = [];
                for (const item of pendingVideos) {
                    const res = await uploadToAllAccounts(item.file, 'video');
                    uploadedIds.push(res.public_id);
                }
                currentForm.videos = [...currentForm.videos, ...uploadedIds];
            }

            toast.loading("Recording Masterpiece in DB...", { id: 'save' });

            const payload = {
                ...currentForm,
                mrp: roundToTwo(currentForm.mrp),
                price: roundToTwo(currentForm.price),
                offerPrice: currentForm.isOfferProduct ? roundToTwo(currentForm.price * (1 - currentForm.discountPercent / 100)) : roundToTwo(currentForm.price),
                variants: currentForm.variants.map(v => ({ ...v, price: roundToTwo(v.price) })),
                discountPercent: parseInt(currentForm.discountPercent),
                showWashCare: !!currentForm.showWashCare,
                isReadyStock: !!currentForm.isReadyStock,
                allowToBuy: !!currentForm.allowToBuy,
                isVisible: !!currentForm.isVisible,
                unit: currentForm.unit || "PIECE"
            };

            if (editingId) {
                await updateProduct(editingId, payload);
                if (itemsToDelete.length > 0) {
                    const imagesToDelete = itemsToDelete.filter(item => item.type === 'image').map(item => item.id);
                    const videosToDelete = itemsToDelete.filter(item => item.type === 'video').map(item => item.id);
                    
                    if (imagesToDelete.length > 0) await deleteFromAllAccounts(imagesToDelete, 'image');
                    if (videosToDelete.length > 0) await deleteFromAllAccounts(videosToDelete, 'video');
                }
                toast.success("Product Updated Successfully", { id: 'save' });
                setDeletedMedia([]);
            } else {
                await createProduct(payload);
                toast.success("Product Added Successfully", { id: 'save' });
            }

            setIsOpen(false);
            setSelectedImages([]);
            setPendingVideos([]);
            loadData();
        } catch (err) {
            toast.error(err.message || "Sync failed. Media was not saved.", { id: 'save' });
        } finally {
            setIsSaving(false);
        }
    };

    // Filter subs based on selected category
    const availableSubs = form.categoryId ? subs.filter(s => s.categoryId === form.categoryId) : subs;
    const availableInners = form.subCategoryId ? inners.filter(i => i.subCategoryId === form.subCategoryId) : inners;

    return (
        <div className="max-w-6xl mx-auto">
            <style jsx global>{`
                input[type='number']::-webkit-inner-spin-button,
                input[type='number']::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type='number'] {
                    -moz-appearance: textfield;
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-primary">Master Catalog</h1>
                    <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Master Catalog Product Management</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative group w-full sm:w-80">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-brand-primary/5 rounded-xl p-4 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
                        />
                    </div>
                    <button onClick={() => { setEditingId(null); setForm(initForm); setErrors({}); setIsOpen(true); setStep(1); setOfferType("price"); }} className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl whitespace-nowrap flex items-center gap-2">
                        <Icon icon="lucide:plus" className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {loading ? <div className="text-center py-20"><Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" /></div> : (
                <div className="bg-white rounded-[32px] shadow-sm border border-brand-primary/5 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm min-w-[1000px]">
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
                                            {p.images[0] ? (
                                                <img src={p.images[0].startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${p.images[0]}` : p.images[0]} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full"><Icon icon="lucide:image" className="opacity-20" /></div>
                                            )}
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
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(p)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${p.isVisible ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                title={p.isVisible ? "Visible on Website" : "Hidden from Website"}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm ${p.isVisible ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                            <button onClick={() => {
                                                setEditingId(p.id);
                                                setForm({
                                                    ...p,
                                                    innerSubId: p.innerSubId || "",
                                                    details: Array.isArray(p.details) ? p.details : [],
                                                    showWashCare: !!p.showWashCare,
                                                    isReadyStock: !!p.isReadyStock,
                                                    wholesalerDescription: p.wholesalerDescription || "",
                                                    allowToBuy: p.allowToBuy !== undefined ? p.allowToBuy : true,
                                                    variants: (Array.isArray(p.variants) ? p.variants : []).map(v => ({ ...v, id: v.id || Math.random().toString(36).substr(2, 9) })),
                                                    unit: p.unit || "PIECE",
                                                    isVisible: p.isVisible !== undefined ? p.isVisible : true
                                                });
                                                setOfferType(p.discountPercent > 0 ? "percentage" : "price");
                                                setStep(1);
                                                setErrors({});
                                                setIsOpen(true);
                                            }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Icon icon="lucide:edit-2" /></button>
                                            <button onClick={() => { setItemToDelete(p); setIsDeleteModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Icon icon="lucide:trash-2" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto py-8">
                    <div className="bg-white max-w-5xl w-full rounded-[40px] p-6 lg:p-10 shadow-2xl relative my-auto">
                        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all z-10"><Icon icon="lucide:x" className="w-5 h-5" /></button>

                        <div className="mb-6 block">
                            <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Update' : 'Add'} Product</h2>
                            <div className="flex gap-4 mt-6">
                                {['Identity', 'Economics', 'Registry', 'Assets'].map((label, i) => {
                                    const s = i + 1;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            disabled={!editingId}
                                            onClick={() => setStep(s)}
                                            className={`flex-1 group flex flex-col gap-4 text-left transition-all py-4 -my-4 outline-none ${editingId ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <div className={`h-1.5 w-full rounded-full transition-all duration-700 ${step >= s ? 'bg-brand-secondary shadow-[0_0_10px_rgba(var(--brand-secondary-rgb),0.3)]' : 'bg-gray-100'} ${editingId ? 'group-hover:bg-brand-secondary/50 group-hover:scale-y-125' : ''}`} />
                                            <span className={`text-[9px] uppercase tracking-[0.3em] font-black transition-all duration-300 ${step === s ? 'text-brand-primary' : 'text-brand-primary/30'} ${editingId ? 'group-hover:text-brand-primary' : ''}`}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-6">
                                        <div className="p-7 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                                    <Icon icon="fluent-mdl2:product" className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary/60">Product Identifiers</h4>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <label className={`text-[10px] uppercase tracking-[0.2em] font-black block mb-2 ml-1 transition-colors ${errors.productId ? 'text-red-500' : 'text-brand-primary/40 group-focus-within:text-brand-primary'}`}>Product ID / SKU</label>
                                                    <input type="text" value={form.productId} onChange={e => { setForm({ ...form, productId: e.target.value.toUpperCase() }); if (errors.productId) setErrors(prev => ({ ...prev, productId: null })); }} className={`w-full p-5 border rounded-[24px] bg-white font-serif font-bold text-lg transition-all outline-none shadow-inner ${errors.productId ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-brand-primary/5 focus:border-brand-secondary/40 text-brand-primary'}`} placeholder="E.G. VG A-517" required />
                                                    {errors.productId && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2 ml-1">{errors.productId}</p>}
                                                </div>
                                                <div className="group">
                                                    <label className={`text-[10px] uppercase tracking-[0.2em] font-black block mb-2 ml-1 transition-colors ${errors.name ? 'text-red-500' : 'text-brand-primary/40 group-focus-within:text-brand-primary'}`}>Product Display Name</label>
                                                    <input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) }); if (errors.name) setErrors(prev => ({ ...prev, name: null })); }} className={`w-full p-5 border rounded-[24px] bg-white font-serif font-bold text-lg transition-all outline-none shadow-inner ${errors.name ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-brand-primary/5 focus:border-brand-secondary/40 text-brand-primary'}`} placeholder="Enter Product Name" required />
                                                    {errors.name && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2 ml-1">{errors.name}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-7 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                                    <Icon icon="solar:layers-bold-duotone" className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-primary/60">Category Selection</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <CustomSelect
                                                        placeholder="1. Select Primary Category"
                                                        options={cats.map(c => ({ value: c.id, label: c.name }))}
                                                        value={form.categoryId}
                                                        onChange={val => { setForm({ ...form, categoryId: val, subCategoryId: '', innerSubId: null }); if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: null })); }}
                                                        isSearchable={true}
                                                        className={`mb-2 ${errors.categoryId ? 'ring-2 ring-red-500 rounded-xl' : ''}`}
                                                    />
                                                    {errors.categoryId && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1 ml-1">{errors.categoryId}</p>}
                                                </div>
                                                <div>
                                                    <CustomSelect
                                                        placeholder="2. Select Luxury Sub-category"
                                                        options={availableSubs.map(c => ({ value: c.id, label: c.name }))}
                                                        value={form.subCategoryId}
                                                        onChange={val => { setForm({ ...form, subCategoryId: val, innerSubId: null }); if (errors.subCategoryId) setErrors(prev => ({ ...prev, subCategoryId: null })); }}
                                                        isSearchable={true}
                                                        disabled={!form.categoryId}
                                                        className={`mb-2 ${errors.subCategoryId ? 'ring-2 ring-red-500 rounded-xl' : ''}`}
                                                    />
                                                    {errors.subCategoryId && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1 ml-1">{errors.subCategoryId}</p>}
                                                </div>
                                                <CustomSelect
                                                    placeholder="3. Select Divine Variant (Optional)"
                                                    options={availableInners.map(c => ({ value: c.id, label: c.name }))}
                                                    value={form.innerSubId || ""}
                                                    onChange={val => setForm({ ...form, innerSubId: val })}
                                                    isSearchable={true}
                                                    disabled={!form.subCategoryId || availableInners.length === 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-6">
                                        <div className="bg-brand-accent/30 rounded-[32px] p-7 border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-brand-secondary/10 rounded-[20px] flex items-center justify-center shadow-inner">
                                                    <Icon icon="solar:wallet-money-bold-duotone" className="w-6 h-6 text-brand-secondary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[12px] uppercase tracking-[0.3em] font-black text-brand-primary">Financials</h4>
                                                    <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest mt-0.5">Economic Parameters</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <label className={`text-[10px] uppercase tracking-widest font-black ml-2 transition-colors ${errors.mrp ? 'text-red-500' : 'text-brand-primary/30'}`}>MRP</label>
                                                        <div className="relative group">
                                                            <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-serif text-xl transition-colors ${errors.mrp ? 'text-red-400' : 'text-brand-primary/20'}`}>₹</span>
                                                            <input type="number" min="0" onWheel={(e) => e.target.blur()} value={form.mrp} onChange={e => { setForm({ ...form, mrp: e.target.value }); if (errors.mrp) setErrors(prev => ({ ...prev, mrp: null })); }} className={`w-full p-5 pl-12 border rounded-[24px] bg-white font-serif font-black text-2xl transition-all outline-none shadow-inner ${errors.mrp ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-brand-primary/5 focus:border-brand-secondary/40 text-brand-primary'}`} placeholder="0" required />
                                                        </div>
                                                        {errors.mrp && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1 ml-2">{errors.mrp}</p>}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className={`text-[10px] uppercase tracking-widest font-black ml-2 transition-colors ${errors.price ? 'text-red-500' : 'text-brand-secondary/60'}`}>Sale Price</label>
                                                        <div className="relative group">
                                                            <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-serif text-xl transition-colors ${errors.price ? 'text-red-400' : 'text-brand-secondary/40'}`}>₹</span>
                                                            <input type="number" min="0" onWheel={(e) => e.target.blur()} value={form.price} onChange={e => { setForm({ ...form, price: e.target.value }); if (errors.price) setErrors(prev => ({ ...prev, price: null })); }} className={`w-full p-5 pl-12 border rounded-[24px] font-serif font-black text-2xl transition-all outline-none shadow-inner ${errors.price ? 'border-red-500 focus:border-red-600 bg-red-50/10' : 'border-brand-secondary/10 bg-brand-secondary/5 text-brand-secondary focus:border-brand-secondary/40'}`} placeholder="0" required />
                                                        </div>
                                                        {errors.price && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1 ml-2">{errors.price}</p>}
                                                    </div>
                                                </div>
                                                <div className={`p-6 rounded-[28px] border transition-all duration-700 ${form.isOfferProduct ? 'bg-white border-brand-primary/20 shadow-xl' : 'bg-brand-primary/5 border-transparent'}`}>
                                                    <label className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${form.isOfferProduct ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                                <Icon icon="solar:tag-bold" className="w-6 h-6" />
                                                            </div>
                                                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${form.isOfferProduct ? 'text-brand-primary' : 'text-brand-primary/30'}`}>Discount Offer</span>
                                                        </div>
                                                        <input type="checkbox" checked={form.isOfferProduct} onChange={e => setForm({ ...form, isOfferProduct: e.target.checked })} className="sr-only peer" />
                                                        <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-[28px] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary relative"></div>
                                                    </label>
                                                    {form.isOfferProduct && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-6 border-t border-brand-primary/5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex-1">
                                                                    <label className={`text-[10px] uppercase tracking-widest font-black block mb-2 px-1 transition-colors ${errors.discountPercent ? 'text-red-500' : 'text-brand-primary/40'}`}>Discount (%)</label>
                                                                    <div className="relative">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            onWheel={(e) => e.target.blur()}
                                                                            value={form.discountPercent}
                                                                            onChange={e => {
                                                                                let val = e.target.value;
                                                                                if (val > 100) val = 100;
                                                                                if (val < 0) val = 0;
                                                                                setForm({ ...form, discountPercent: val });
                                                                                if (errors.discountPercent) setErrors(prev => ({ ...prev, discountPercent: null }));
                                                                            }}
                                                                            className={`w-full p-5 border rounded-[24px] bg-brand-primary/5 font-serif font-black text-2xl transition-all outline-none ${errors.discountPercent ? 'border-red-500 focus:border-red-600 bg-red-50/10 text-red-500' : 'border-brand-primary/10 text-brand-primary focus:border-brand-primary/40'}`}
                                                                            placeholder="0"
                                                                        />
                                                                        <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-xl font-bold transition-colors ${errors.discountPercent ? 'text-red-400' : 'text-brand-primary/30'}`}>%</span>
                                                                    </div>
                                                                    {errors.discountPercent && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2 px-1">{errors.discountPercent}</p>}
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center mt-5">
                                                                    <span className="text-[8px] font-black uppercase text-brand-primary/30 mb-1">Price</span>
                                                                    <span className="font-serif font-black text-xl text-brand-primary">₹{roundToTwo(form.price * (1 - form.discountPercent / 100)).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className={`p-6 rounded-[28px] border transition-all duration-700 bg-brand-primary/5 border-transparent`}>
                                                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-primary/40 block mb-3 ml-1">Accept Order In</label>
                                                    <div className="flex gap-4">
                                                        {["PIECE", "DOZEN"].map((u) => (
                                                            <button
                                                                key={u}
                                                                type="button"
                                                                onClick={() => setForm({ ...form, unit: u })}
                                                                className={`grow py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${form.unit === u ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-brand-primary/40 border border-brand-primary/10'}`}
                                                            >
                                                                {u}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2 */}
                                    <div className="space-y-6 h-full flex flex-col">
                                        <div className="bg-white rounded-[32px] p-7 border border-brand-primary/10 shadow-[0_20px_50_rgba(0,0,0,0.03)] h-full flex flex-col gap-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                                                        <Icon icon="solar:layers-bold-duotone" className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-primary">Product Variants</h4>
                                                        <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest">Multi-Variants Registry</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => setForm({ ...form, variants: [...form.variants, { id: Math.random().toString(36).substr(2, 9), name: "", price: "" }] })} className="w-10 h-10 bg-brand-primary text-white rounded-[12px] flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-brand-primary/20"><Icon icon="lucide:plus" className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 ml-2">
                                                <button
                                                    type="button"
                                                    title="VG"
                                                    onClick={() => {
                                                        const q = ["0", "1", "2", "3", "4", "5", "6"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    VG
                                                </button>

                                                <button
                                                    type="button"
                                                    title="LP"
                                                    onClick={() => {
                                                        const q = ["2", "3", "4", "5", "6", "7", "9", "11"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    LP
                                                </button>
                                                <button
                                                    type="button"
                                                    title="AASAN"
                                                    onClick={() => {
                                                        const q = [
                                                            "3x4",
                                                            "4x6",
                                                            "6x8",
                                                            "8x10",
                                                            "10x13",
                                                            "12x15",
                                                            "15x18",
                                                            "6x12",
                                                            "8x16",
                                                            "10x20",
                                                            "12x30",
                                                            "15x36",
                                                            "14x14",
                                                            "16x16",
                                                            "18x18",
                                                            "20x20",
                                                        ];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    AASAN
                                                </button>
                                                <button
                                                    type="button"
                                                    title="JAMA"
                                                    onClick={() => {
                                                        const q = ["00", "0", "1", "2", "3", "4", "5", "6", "7", "9"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    JAMA
                                                </button>
                                                <button
                                                    type="button"
                                                    title="DG"
                                                    onClick={() => {
                                                        const q = ["5", "6", "7", "9", "12", "15", "18", "21"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    DG
                                                </button>
                                                <button
                                                    type="button"
                                                    title="FT"
                                                    onClick={() => {
                                                        const q = ["5", "8", "10", "13", "18", "24", "30", "38", "48", "78"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    FT
                                                </button>
                                                <button
                                                    type="button"
                                                    title="MUKUT"
                                                    onClick={() => {
                                                        const q = ["5", "8", "10", "13", "18", "24", "30", "38", "48", "78"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    MUKUT
                                                </button>
                                                <button
                                                    type="button"
                                                    title="HANJUMANJI"
                                                    onClick={() => {
                                                        const q = ["5", "6", "7", "9", "12", "15", "18", "21", "24", "27", "30"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    HM
                                                </button>
                                                <button
                                                    type="button"
                                                    title="RK"
                                                    onClick={() => {
                                                        const q = ["2", "3", "4", "5", "6", "7", "9", "12", "15", "18"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    RK
                                                </button>
                                                <button
                                                    type="button"
                                                    title="GM"
                                                    onClick={() => {
                                                        const q = ["Regular"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    GM
                                                </button>
                                                <button
                                                    type="button"
                                                    title="RD"
                                                    onClick={() => {
                                                        const q = ["2", "3", "4", "5", "6", "7", "9", "12", "15", "18"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    RD
                                                </button>
                                                <button
                                                    type="button"
                                                    title="SIHASAN"
                                                    onClick={() => {
                                                        const q = ["1", "2", "3", "4", "5"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    SIHASAN
                                                </button>
                                                <button
                                                    type="button"
                                                    title="ZULA"
                                                    onClick={() => {
                                                        const q = ["4", "6", "8"];
                                                        setForm({ ...form, variants: [...form.variants, ...q.map(s => ({ id: Math.random().toString(36).substr(2, 9) + Math.random(), name: s, price: "" }))] });
                                                        toast.success("Injected common sizes");
                                                    }}
                                                    className="min-w-10 h-10 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded-[12px] flex items-center justify-center border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    ZULA
                                                </button>
                                            </div>
                                            <div className="flex-grow overflow-y-auto no-scrollbar max-h-[400px]">
                                                <Reorder.Group axis="y" values={form.variants} onReorder={(newOrder) => setForm({ ...form, variants: newOrder })} className="space-y-3">
                                                    {form.variants.map((v, i) => (
                                                        <Reorder.Item
                                                            key={v.id || i}
                                                            value={v}
                                                            className="flex gap-3 items-center group/variant"
                                                        >
                                                            <div className="cursor-grab active:cursor-grabbing p-2 text-brand-primary/20 group-hover/variant:text-brand-primary/40 transition-colors">
                                                                <Icon icon="solar:hamburger-menu-linear" className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Size (e.g. S, M, L, XL)"
                                                                    value={v.name}
                                                                    onChange={e => {
                                                                        const nv = [...form.variants];
                                                                        nv[i].name = e.target.value;
                                                                        setForm({ ...form, variants: nv });
                                                                        if (errors.variants?.[i]?.name) {
                                                                            const newV = [...errors.variants];
                                                                            newV[i].name = "";
                                                                            setErrors(prev => ({ ...prev, variants: newV }));
                                                                        }
                                                                    }}
                                                                    className={`w-full h-12 px-4 rounded-2xl bg-white border transition-all outline-none text-[14px] font-bold ${errors.variants?.[i]?.name ? 'border-red-500 focus:border-red-600 bg-red-50/20' : 'border-brand-primary/10 focus:border-brand-primary text-brand-primary'}`}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="w-28 relative">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    onWheel={(e) => e.target.blur()}
                                                                    placeholder="0"
                                                                    value={v.price}
                                                                    onChange={e => {
                                                                        const nv = [...form.variants];
                                                                        nv[i].price = e.target.value;
                                                                        setForm({ ...form, variants: nv });
                                                                        if (errors.variants?.[i]?.price) {
                                                                            const newV = [...errors.variants];
                                                                            newV[i].price = "";
                                                                            setErrors(prev => ({ ...prev, variants: newV }));
                                                                        }
                                                                    }}
                                                                    className={`w-full h-12 px-4 rounded-2xl bg-white border transition-all outline-none text-[16px] font-serif font-bold text-right ${errors.variants?.[i]?.price ? 'border-red-500 focus:border-red-600 bg-red-50/20 text-red-500' : 'border-brand-primary/10 focus:border-brand-primary text-brand-secondary'}`}
                                                                    required
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setForm({
                                                                    ...form,
                                                                    variants: form.variants.filter((_, idx) => idx !== i)
                                                                })}
                                                                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-400 hover:text-red-500 transition-all"
                                                            >
                                                                <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                                            </button>
                                                        </Reorder.Item>
                                                    ))}
                                                </Reorder.Group>
                                                {form.variants.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center py-10 opacity-10">
                                                        <Icon icon="solar:layers-broken" className="w-12 h-12 mb-2" />
                                                        <span className="text-[10px] uppercase font-black tracking-widest">No Variants Recorded</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="p-7 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)] h-full">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-white rounded-[20px] shadow-sm flex items-center justify-center text-brand-primary">
                                                <Icon icon="solar:eye-bold-duotone" className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] uppercase tracking-[0.3em] font-black text-brand-primary">Display Orchestration</h4>
                                                <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest mt-0.5">Visibility Logic</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                                            {[
                                                { id: 'isBestSeller', label: 'Best Seller', icon: 'solar:star-bold', color: 'text-yellow-500' },
                                                { id: 'isReadyStock', label: 'Ready Stock', icon: 'solar:box-bold', color: 'text-brand-secondary' },
                                                { id: 'showWashCare', label: 'Wash Care', icon: 'ic:twotone-wash', color: 'text-emerald-500' }
                                            ].map((item) => (
                                                <label key={item.id} className={`flex flex-col gap-3 p-4 rounded-[24px] cursor-pointer border transition-all duration-500 ${form[item.id] ? 'bg-brand-primary/90 border-transparent hover:bg-brand-primary' : 'bg-white border-brand-primary/20'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${form[item.id] ? 'bg-white' : 'bg-white/50'}`}>
                                                            <Icon icon={item.icon} className={`w-4 h-4 ${form[item.id] ? item.color : 'text-brand-primary'}`} />
                                                        </div>
                                                        <input type="checkbox" checked={form[item.id]} onChange={e => setForm({ ...form, [item.id]: e.target.checked })} className="sr-only" />
                                                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${form[item.id] ? 'bg-white border-brand-primary' : 'border-brand-primary/10'}`} />
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${form[item.id] ? 'text-white' : 'text-brand-primary/70'}`}>{item.label}</span>
                                                </label>
                                            ))}

                                            <div className="col-span-2 lg:col-span-3 p-5 rounded-[24px] border transition-all duration-700 mt-2 bg-brand-primary/5 border-transparent">
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-[15px] flex items-center justify-center transition-all ${form.isVisible ? 'bg-blue-500 text-white shadow-lg' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                            <Icon icon="solar:eye-bold" className="w-5 h-5" />
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${form.isVisible ? 'text-blue-700' : 'text-brand-primary/30'}`}>Show on Website</span>
                                                    </div>
                                                    <input type="checkbox" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-[24px] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 relative"></div>
                                                </label>
                                            </div>

                                            <div className="col-span-2 lg:col-span-3 p-5 rounded-[24px] border transition-all duration-700 bg-brand-primary/5 border-transparent">
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-[15px] flex items-center justify-center transition-all ${form.allowToBuy ? 'bg-emerald-500 text-white shadow-lg' : 'bg-brand-primary/10 text-brand-primary'}`}>
                                                            <Icon icon="solar:cart-large-bold" className="w-5 h-5" />
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${form.allowToBuy ? 'text-emerald-700' : 'text-brand-primary/30'}`}>Allow to Buy</span>
                                                    </div>
                                                    <input type="checkbox" checked={form.allowToBuy} onChange={e => setForm({ ...form, allowToBuy: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-[24px] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-7 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-white rounded-[20px] shadow-sm flex items-center justify-center text-brand-primary">
                                                <Icon icon="solar:medal-star-bold-duotone" className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] uppercase tracking-[0.3em] font-black text-brand-primary">Divine Infusions</h4>
                                                <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest mt-0.5">Specifications Registry</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Fabric", "Embroidery", "Work", "Included"].map((label) => {
                                                const detail = form.details.find(d => d.label === label);
                                                return (
                                                    <div key={label} className="group bg-white p-4 rounded-[20px] border border-brand-primary/5 transition-all focus-within:border-brand-secondary/40">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-brand-secondary/40" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary/30 group-focus-within:text-brand-secondary transition-colors">{label}</span>
                                                        </div>
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
                                                            placeholder={`Define ${label}...`}
                                                            className="w-full bg-transparent border-none outline-none p-0 font-serif font-bold text-sm text-brand-primary placeholder:text-brand-primary/10"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="lg:col-span-5 space-y-6">
                                        <div className="p-7 bg-brand-accent/30 rounded-[32px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-white rounded-[20px] shadow-sm flex items-center justify-center text-brand-primary">
                                                    <Icon icon="solar:document-text-bold-duotone" className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[12px] uppercase tracking-[0.3em] font-black text-brand-primary">Product Description</h4>
                                                    <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest mt-0.5">Linguistic Composition</p>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="group">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-primary/30 block mb-3 px-1 group-focus-within:text-brand-primary transition-colors">General Description</label>
                                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-6 border border-brand-primary/5 rounded-[32px] bg-white text-[13px] font-bold text-brand-primary h-40 resize-none focus:border-brand-primary/40 outline-none transition-all shadow-inner leading-relaxed" placeholder="Describe the soul of this masterpiece..." />
                                                </div>
                                                <div className="group">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-secondary/40 block mb-3 px-1 group-focus-within:text-brand-secondary transition-colors">Wholesale Only Description</label>
                                                    <textarea value={form.wholesalerDescription} onChange={e => setForm({ ...form, wholesalerDescription: e.target.value })} className="w-full p-6 border border-brand-secondary/10 rounded-[32px] bg-brand-secondary/5 text-[13px] font-bold text-brand-primary h-40 resize-none focus:border-brand-secondary/40 outline-none transition-all shadow-inner leading-relaxed" placeholder="Confidential insights for our valued Wholesaler..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-7 space-y-6">
                                        <div className="p-8 bg-white rounded-[40px] border border-brand-primary/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)] overflow-hidden relative group/payload">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-primary/5 rounded-[20px] flex items-center justify-center text-brand-primary shadow-inner">
                                                        <Icon icon="solar:gallery-bold-duotone" className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-primary">Media Payload</h4>
                                                        <p className="text-[8px] text-brand-primary/40 uppercase font-black tracking-widest mt-0.5">Visual Assets Management</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-primary/20 mb-4 block underline underline-offset-8">Imagery Gallary</span>
                                                    <div
                                                        onDragOver={(e) => { e.preventDefault(); }}
                                                        onDrop={(e) => { e.preventDefault(); handleUpload(null, 'image', Array.from(e.dataTransfer.files)); }}
                                                        className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-3xl border-2 border-dashed transition-all ${errors.images ? 'border-red-500 bg-red-50/10' : 'border-gray-100 hover:border-brand-primary/20'}`}
                                                    >
                                                        {/* Existing Images */}
                                                        {form.images.map((img, i) => (
                                                            <div key={`ex-${i}`} className="aspect-[3/4] rounded-2xl overflow-hidden border border-black/5 relative group shadow-sm transition-transform hover:scale-105">
                                                                <img src={img.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${img}` : img} className="w-full h-full object-cover" />
                                                                <button type="button" onClick={() => {
                                                                    setDeletedMedia(prev => [...prev, { id: img, type: 'image' }]);
                                                                    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
                                                                }} className="absolute inset-0 bg-red-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><Icon icon="solar:trash-bin-trash-bold" className="text-white w-6 h-6" /></button>
                                                            </div>
                                                        ))}

                                                        {/* Selected Pending Images */}
                                                        {selectedImages.map((item, i) => (
                                                            <div key={`pnd-${i}`} className="aspect-[3/4] rounded-2xl overflow-hidden border border-brand-secondary/30 relative group shadow-md transition-transform hover:scale-105 bg-brand-secondary/5">
                                                                <img src={item.preview} className="w-full h-full object-cover opacity-80" />
                                                                <div className="absolute top-1 right-1 bg-brand-secondary text-white p-1 rounded-full"><Icon icon="solar:cloud-upload-bold" className="w-3 h-3" /></div>
                                                                <button type="button" onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><Icon icon="lucide:x" className="text-white w-6 h-6" /></button>
                                                            </div>
                                                        ))}

                                                        <div className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative hover:bg-gray-50 cursor-pointer transition-all ${errors.images ? 'border-red-400 bg-red-50/20' : 'border-gray-200'}`}>
                                                            <Icon icon="solar:camera-add-bold-duotone" className={`w-8 h-8 ${errors.images ? 'text-red-400' : 'text-gray-300'}`} />
                                                            <span className={`text-[7px] font-black uppercase mt-2 ${errors.images ? 'text-red-400' : 'text-gray-400'}`}>Capture Image</span>
                                                            <input type="file" multiple disabled={isCloudSyncing} onChange={(e) => { handleUpload(e, 'image'); if (errors.images) setErrors(prev => ({ ...prev, images: null })); }} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                        </div>
                                                    </div>
                                                    {errors.images && <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2 ml-1">{errors.images}</p>}
                                                </div>

                                                <div>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-primary/20 mb-4 block underline underline-offset-8">Videos Gallery</span>
                                                    <div
                                                        onDragOver={(e) => { e.preventDefault(); }}
                                                        onDrop={(e) => { e.preventDefault(); handleUpload(null, 'video', Array.from(e.dataTransfer.files)); }}
                                                        className={`flex gap-4 overflow-x-auto pt-2 pb-4 no-scrollbar p-4 rounded-3xl border-2 border-dashed transition-all border-gray-100 hover:border-brand-primary/20`}
                                                    >
                                                        {/* Existing Videos */}
                                                        {form.videos.map((vid, i) => (
                                                            <div key={`vx-${i}`} className="w-48 h-28 shrink-0 rounded-2xl overflow-hidden border bg-black relative group shadow-lg">
                                                                <video src={vid.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${vid}` : vid} className="w-full h-full object-cover" />
                                                                <button type="button" onClick={() => {
                                                                    setDeletedMedia(prev => [...prev, { id: vid, type: 'video' }]);
                                                                    setForm({ ...form, videos: form.videos.filter((_, idx) => idx !== i) });
                                                                }} className="absolute inset-0 bg-red-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><Icon icon="solar:trash-bin-trash-bold" className="text-white w-6 h-6" /></button>
                                                            </div>
                                                        ))}

                                                        {/* Pending Videos */}
                                                        {pendingVideos.map((item, i) => (
                                                            <div key={`vp-${i}`} className="w-48 h-28 shrink-0 rounded-2xl overflow-hidden border bg-black relative group shadow-lg border-brand-secondary/30">
                                                                <video src={item.preview} className="w-full h-full object-cover opacity-60" />
                                                                <div className="absolute top-1 right-1 bg-brand-secondary text-white p-1 rounded-full"><Icon icon="solar:cloud-upload-bold" className="w-3 h-3" /></div>
                                                                <button type="button" onClick={() => setPendingVideos(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"><Icon icon="lucide:x" className="text-white w-6 h-6" /></button>
                                                            </div>
                                                        ))}

                                                        <div className={`w-48 h-28 shrink-0 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative hover:bg-gray-50 cursor-pointer transition-all border-gray-200`}>
                                                            <Icon icon="solar:videocamera-add-bold-duotone" className={`w-8 h-8 text-gray-300`} />
                                                            <span className="text-[8px] font-black uppercase mt-2 text-gray-400 tracking-widest">Inject Motion</span>
                                                            <input type="file" multiple disabled={isCloudSyncing} onChange={(e) => handleUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-10 border-t border-brand-primary/5 flex justify-between items-center mt-auto">
                                <button type="button" onClick={() => { setIsOpen(false); setDeletedMedia([]); }} className="px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">Cancel</button>

                                <div className="flex gap-4">
                                    {step > 1 && (
                                        <button type="button" onClick={() => { setStep(s => s - 1); setErrors({}); }} className="px-8 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] bg-gray-100 hover:bg-gray-200 transition-all text-[11px] flex items-center gap-3 text-brand-primary/60"> <Icon icon="lucide:arrow-left" className="w-5 h-5" /> {editingId ? 'Previous' : 'Previous Stage'}</button>
                                    )}

                                    {step < 4 ? (
                                        <button type="button" onClick={editingId ? (() => setStep(s => s + 1)) : handleSubmit} className={`py-5 rounded-[24px] font-black uppercase tracking-[0.2em] transition-all text-[11px] flex items-center gap-3 ${editingId ? 'px-8 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20' : 'px-14 bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20'}`}>
                                            {editingId ? 'Next Section' : 'Proceed'} <Icon icon="lucide:arrow-right" className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        !editingId && (
                                            <button type="button" onClick={handleSubmit} disabled={isCloudSyncing || isSaving} className="px-20 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-2xl shadow-brand-primary/30 text-[11px] flex items-center gap-3">
                                                {isSaving || isCloudSyncing ? <Icon icon="line-md:loading-loop" className="w-5 h-5" /> : <Icon icon="lucide:save" className="w-5 h-5" />}
                                                {isSaving || isCloudSyncing ? 'Uploading...' : 'Save Product'}
                                            </button>
                                        )
                                    )}
                                    {editingId && step === 4 && (
                                        <button type="button" onClick={handleSubmit} disabled={isCloudSyncing || isSaving} className="px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/10 text-[11px] flex items-center gap-3">
                                            {isSaving || isCloudSyncing ? <Icon icon="line-md:loading-loop" className="w-5 h-5" /> : <Icon icon="lucide:save" className="w-5 h-5" />}
                                            {isSaving || isCloudSyncing ? 'Uploading...' : 'Update Product'}
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
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white max-w-sm w-full rounded-[48px] p-10 shadow-2xl text-center border border-black/5"
                    >
                        <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-brand-primary mb-3">Delete Product?</h3>
                        <p className="text-[11px] text-brand-primary/40  font-black tracking-[0.2em] mb-10 leading-relaxed px-4">
                            "{itemToDelete?.name}" will be permanently deleted from the registry.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="grow py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest text-brand-primary hover:bg-gray-50 transition-all border border-brand-primary/10 cursor-pointer"
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
                                className="grow py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
