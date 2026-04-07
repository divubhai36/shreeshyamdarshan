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

  const initForm = { productId:"", name:"", slug:"", description:"", mrp:0, price:0, offerPrice:0, discountPercent: 0, categoryId:"", subCategoryId:"", innerSubId:null, images:[], videos:[], isBestSeller:false, isOfferProduct:false };
  const [form, setForm] = useState(initForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [pRes, cRes, sRes, iRes] = await Promise.all([getProducts(), getCategories(), getSubCategories(), getInnerSubCategories()]);
    setData(pRes); setCats(cRes); setSubs(sRes); setInners(iRes);
    setLoading(false);
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'image') setUploadingImage(true);
    else setUploadingVideo(true);
    
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const dt = await res.json();
      if(dt.url) {
         if(type === 'image') setForm({...form, images: [...form.images, dt.url]});
         if(type === 'video') setForm({...form, videos: [...form.videos, dt.url]});
         toast.success("Asset Linked");
      }
    } catch(err) { toast.error("Upload failed"); }

    
    if (type === 'image') setUploadingImage(false);
    else setUploadingVideo(false);
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

    const payload = { ...form, mrp: parseFloat(form.mrp), price: parseFloat(form.price), offerPrice: parseFloat(form.offerPrice), discountPercent: parseInt(form.discountPercent) };
    if(!payload.innerSubId) payload.innerSubId = null; 
    
    try {
        if(editingId) {
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
    <div className="max-w-7xl mx-auto">
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
                                <button onClick={() => { setEditingId(p.id); setForm({...p, innerSubId: p.innerSubId || ""}); setOfferType(p.discountPercent > 0 ? "percentage" : "price"); setStep(1); setIsOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Icon icon="lucide:edit-2" /></button>
                                <button onClick={async () => { if(confirm("Delete this masterpiece?")) { await deleteProduct(p.id); toast.success("Masterpiece Removed"); loadData(); } }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Icon icon="lucide:trash-2" /></button>

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
            <button onClick={()=>setIsOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"><Icon icon="lucide:x" /></button>
            <div className="mb-10 block">
                <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Modify' : 'Inject'} Masterpiece</h2>
                <div className="flex gap-2 mt-4">
                    {[1,2,3].map(s => (
                        <div key={s} className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${step >= s ? 'bg-brand-secondary' : 'bg-gray-100'}`} />
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
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <div className="p-8 bg-brand-accent/20 rounded-[32px] border border-brand-primary/5">
                                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-brand-primary/40">Primary Identifiers</h4>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold block mb-1.5 ml-1">Product ID / SKU</label>
                                        <input type="text" value={form.productId} onChange={e=>setForm({...form, productId: e.target.value.toUpperCase()})} className="w-full p-4 border border-black/10 rounded-2xl bg-white font-mono text-[11px] focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none" placeholder="e.g. VG A-517" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold block mb-1.5 ml-1">Product Name</label>
                                        <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value, slug: slugify(e.target.value)})} className="w-full p-4 border border-black/10 rounded-2xl bg-white focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none" placeholder="Enter Product Name" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-8 bg-brand-primary rounded-[32px] text-white shadow-xl">
                                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-white/40">Taxonomy Placement</h4>
                                <div className="space-y-3">
                                    <CustomSelect 
                                        placeholder="1. Select Category"
                                        options={cats.map(c => ({ value: c.id, label: c.name }))}
                                        value={form.categoryId}
                                        onChange={val => setForm({...form, categoryId: val, subCategoryId: '', innerSubId: null})}
                                        isSearchable={true}
                                        className="mb-2"
                                        theme="dark"
                                    />
                                    <CustomSelect 
                                        placeholder="2. Select Sub-category"
                                        options={availableSubs.map(c => ({ value: c.id, label: c.name }))}
                                        value={form.subCategoryId}
                                        onChange={val => setForm({...form, subCategoryId: val, innerSubId: null})}
                                        isSearchable={true}
                                        disabled={!form.categoryId}
                                        className="mb-2"
                                        theme="dark"
                                    />
                                    <CustomSelect 
                                        placeholder="3. Optional Inner Filter"
                                        options={availableInners.map(c => ({ value: c.id, label: c.name }))}
                                        value={form.innerSubId || ""}
                                        onChange={val => setForm({...form, innerSubId: val})}
                                        isSearchable={true}
                                        disabled={!form.subCategoryId || availableInners.length===0}
                                        theme="dark"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">MRP (Original)</label>
                                    <input type="number" value={form.mrp} onChange={e=>setForm({...form, mrp: e.target.value})} className="w-full p-4 border border-black/10 rounded-2xl bg-gray-50 mt-1 font-serif" required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary">Selling Price</label>
                                    <input type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value, offerPrice: form.isOfferProduct && offerType==='percentage' ? (e.target.value * (1 - form.discountPercent/100)).toFixed(2) : form.offerPrice})} className="w-full p-4 border border-brand-secondary/30 rounded-2xl bg-brand-secondary/5 mt-1 font-serif font-bold" required />
                                </div>
                            </div>

                            <div className="p-6 bg-brand-accent/20 rounded-[32px] border border-brand-primary/5">
                                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer mb-4">
                                    <input type="checkbox" checked={form.isOfferProduct} onChange={e=>setForm({...form, isOfferProduct: e.target.checked})} className="w-6 h-6 rounded-lg accent-brand-secondary" />
                                    Enable Special Offer
                                </label>

                                {form.isOfferProduct && (
                                    <div className="space-y-4 pt-2 border-t border-brand-primary/5 mt-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 p-1 bg-white rounded-xl border border-black/5">
                                            <button type="button" onClick={()=>setOfferType("price")} className={`flex-grow py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${offerType==='price' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-gray-50 text-brand-primary/40'}`}>Fixed Price</button>
                                            <button type="button" onClick={()=>setOfferType("percentage")} className={`flex-grow py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${offerType==='percentage' ? 'bg-brand-primary text-white shadow-lg' : 'hover:bg-gray-50 text-brand-primary/40'}`}>Percentage</button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {offerType === 'price' ? (
                                                <div className="col-span-2">
                                                    <label className="text-[9px] uppercase tracking-widest font-bold text-red-500">Promotional Offer Price</label>
                                                    <input type="number" value={form.offerPrice} onChange={e=>setForm({...form, offerPrice: e.target.value})} className="w-full p-4 border border-red-200 rounded-2xl bg-red-50 mt-1 font-serif font-bold text-red-600" required />
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <label className="text-[9px] uppercase tracking-widest font-bold text-red-500">Discount %</label>
                                                        <input type="number" value={form.discountPercent} onChange={e=>{
                                                            const pct = e.target.value;
                                                            const op = (form.price * (1 - pct/100)).toFixed(2);
                                                            setForm({...form, discountPercent: pct, offerPrice: op});
                                                        }} className="w-full p-4 border border-red-200 rounded-2xl bg-red-50 mt-1 font-serif font-bold text-red-600" required />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Calculated Offer</label>
                                                        <div className="w-full p-4 border border-black/5 rounded-2xl bg-white mt-1 font-serif font-bold text-brand-primary opacity-50">₹{form.offerPrice}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 border border-brand-primary/5 rounded-3xl bg-gray-50/50">
                                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer">
                                    <input type="checkbox" checked={form.isBestSeller} onChange={e=>setForm({...form, isBestSeller: e.target.checked})} className="w-6 h-6 rounded-lg accent-brand-primary" />
                                    Mark as Best Seller
                                </label>
                            </div>
                            <div className="p-8 bg-brand-primary rounded-3xl text-white">
                                <Icon icon="solar:tag-price-bold-duotone" className="w-12 h-12 text-brand-secondary mb-4" />
                                <h4 className="font-serif font-bold uppercase tracking-widest text-sm">Value Proposition</h4>
                                <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest leading-relaxed">Configure the pricing strategy and promotional tags for this masterpiece.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-bold">Rich Description (Optional)</label>
                                <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full p-4 border border-black/10 rounded-2xl bg-gray-50 mt-1 h-32 lg:h-48 resize-none" placeholder="Tell the story of this divine creation..." />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <label className="text-[10px] uppercase tracking-widest font-bold block mb-2">Cloudinary Media Payload</label>
                            <div className="grid grid-cols-4 gap-3">
                                {form.images.map((img, i) => <div key={i} className="aspect-square rounded-2xl overflow-hidden border relative group"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={()=>setForm({...form, images: form.images.filter((_, idx)=>idx!==i)})} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                                <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative hover:bg-gray-50 cursor-pointer">
                                    {uploadingImage ? <Icon icon="line-md:loading-loop" /> : <Icon icon="lucide:image-plus" className="text-gray-400" />}
                                    <input type="file" disabled={uploadingImage} onChange={(e)=>handleUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pt-2 no-scrollbar">
                                {form.videos.map((vid, i) => <div key={i} className="w-32 h-20 shrink-0 rounded-2xl overflow-hidden border bg-black relative group"><video src={vid} className="w-full h-full object-cover" /><button type="button" onClick={()=>setForm({...form, videos: form.videos.filter((_, idx)=>idx!==i)})} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                                <div className="w-32 h-20 shrink-0 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative hover:bg-gray-50 cursor-pointer">
                                    {uploadingVideo ? <Icon icon="line-md:loading-loop" /> : <><Icon icon="lucide:video" className="text-gray-400 mr-2 w-4 h-4" /><span className="text-[9px] font-bold uppercase text-gray-400">Add Video</span></>}
                                    <input type="file" disabled={uploadingVideo} onChange={(e)=>handleUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                <div className="col-span-1 md:col-span-2 pt-8 border-t border-black/5 flex justify-between items-center gap-4">
                    <button type="button" onClick={()=>setIsOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Terminate Process</button>
                    
                    <div className="flex gap-4">
                        {step > 1 && (
                            <button type="button" onClick={()=>setStep(s=>s-1)} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-all text-[10px]">Backward</button>
                        )}
                        
                        {step < 3 ? (
                            <button type="button" onClick={()=>setStep(s=>s+1)} className="px-10 py-4 lg:px-14 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-[10px] flex items-center gap-2">
                                Proceed <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={uploadingImage || uploadingVideo} className="px-10 py-4 lg:px-14 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-[10px] flex items-center gap-2">
                                <Icon icon="lucide:save" className="w-4 h-4" /> Finalize Injection
                            </button>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
