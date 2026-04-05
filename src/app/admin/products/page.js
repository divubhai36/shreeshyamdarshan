"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getSubCategories, getInnerSubCategories } from "../actions";
import CustomSelect from "@/components/admin/CustomSelect";

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [inners, setInners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initForm = { name:"", slug:"", description:"", mrp:0, price:0, categoryId:"", subCategoryId:"", innerSubId:null, images:[], videos:[], isBestSeller:false, isOfferProduct:false };
  const [form, setForm] = useState(initForm);
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const dt = await res.json();
      if(dt.url) {
         if(type === 'image') setForm({...form, images: [...form.images, dt.url]});
         if(type === 'video') setForm({...form, videos: [...form.videos, dt.url]});
      }
    } catch(err) { alert("Upload failed"); }
    setUploading(false);
  };

  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, mrp: parseFloat(form.mrp), price: parseFloat(form.price) };
    if(!payload.innerSubId) payload.innerSubId = null; // Fix optional DB field strictness
    if(editingId) await updateProduct(editingId, payload);
    else await createProduct(payload);
    setIsOpen(false);
    loadData();
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
          <button onClick={() => { setEditingId(null); setForm(initForm); setIsOpen(true); }} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all shadow-xl whitespace-nowrap flex items-center gap-2">
           <Icon icon="lucide:plus" className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? <div className="text-center py-20"><Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary mx-auto" /></div> : (
        <div className="bg-white rounded-3xl shadow-sm border border-brand-primary/5 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-brand-primary/5 text-[10px] uppercase font-bold text-brand-primary/60 tracking-widest">
                    <tr>
                        <th className="p-5 w-16">Media</th>
                        <th className="p-5">Name & Taxonomy</th>
                        <th className="p-5">Pricing</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                    {data.filter(p =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                                <p className="text-[10px] text-brand-secondary tracking-widest uppercase font-bold mt-1">{p.category?.name} {p.subCategory ? `› ${p.subCategory.name}` : ''}</p>
                            </td>
                            <td className="p-5">
                                <p className="font-bold text-black font-serif">₹{p.price}</p>
                                {p.mrp > p.price && <p className="text-[10px] line-through text-gray-400">₹{p.mrp}</p>}
                            </td>
                            <td className="p-5">
                                <div className="flex gap-2">
                                    {p.isBestSeller && <span className="bg-yellow-100 text-yellow-800 text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Best</span>}
                                    {p.isOfferProduct && <span className="bg-red-100 text-red-800 text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest">Offer</span>}
                                </div>
                            </td>
                            <td className="p-5 text-right">
                                <button onClick={() => { setEditingId(p.id); setForm({...p, innerSubId: p.innerSubId || ""}); setIsOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Icon icon="lucide:edit-2" /></button>
                                <button onClick={async () => { if(confirm("Delete this masterpiece?")) { await deleteProduct(p.id); loadData(); } }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Icon icon="lucide:trash-2" /></button>
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
            <h2 className="text-3xl font-serif font-bold text-brand-primary mb-8">{editingId ? 'Modify' : 'Inject'} Masterpiece</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col */}
                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold">Product Name</label>
                        <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value, slug: slugify(e.target.value)})} className="w-full p-4 border border-black/10 rounded-2xl bg-gray-50 mt-1" required />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold">Description (Optional)</label>
                        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full p-4 border border-black/10 rounded-2xl bg-gray-50 mt-1 h-24" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">MRP (Original)</label>
                            <input type="number" value={form.mrp} onChange={e=>setForm({...form, mrp: e.target.value})} className="w-full p-4 border border-black/10 rounded-2xl bg-gray-50 mt-1 font-serif" required />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary">Selling Price</label>
                            <input type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="w-full p-4 border border-brand-secondary/30 rounded-2xl bg-brand-secondary/5 mt-1 font-serif font-bold" required />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><input type="checkbox" checked={form.isBestSeller} onChange={e=>setForm({...form, isBestSeller: e.target.checked})} className="w-5 h-5 accent-brand-secondary" /> Best Seller</label>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><input type="checkbox" checked={form.isOfferProduct} onChange={e=>setForm({...form, isOfferProduct: e.target.checked})} className="w-5 h-5 accent-brand-primary" /> Offer Tag</label>
                    </div>
                </div>

                {/* Right Col */}
                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold">Taxonomy Hierarchy</label>
                        <CustomSelect 
                            placeholder="1. Select Category"
                            options={cats.map(c => ({ value: c.id, label: c.name }))}
                            value={form.categoryId}
                            onChange={val => setForm({...form, categoryId: val, subCategoryId: '', innerSubId: null})}
                            isSearchable={true}
                            className="mb-2"
                        />
                        <CustomSelect 
                            placeholder="2. Select Sub-category"
                            options={availableSubs.map(c => ({ value: c.id, label: c.name }))}
                            value={form.subCategoryId}
                            onChange={val => setForm({...form, subCategoryId: val, innerSubId: null})}
                            isSearchable={true}
                            disabled={!form.categoryId}
                            className="mb-2"
                        />
                        <CustomSelect 
                            placeholder="3. Optional Inner Filter"
                            options={availableInners.map(c => ({ value: c.id, label: c.name }))}
                            value={form.innerSubId || ""}
                            onChange={val => setForm({...form, innerSubId: val})}
                            isSearchable={true}
                            disabled={!form.subCategoryId || availableInners.length===0}
                        />
                    </div>

                    <div className="pt-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold block mb-2">Cloudinary Media Payload</label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {form.images.map((img, i) => <div key={i} className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border relative group"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={()=>setForm({...form, images: form.images.filter((_, idx)=>idx!==i)})} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                            <div className="w-16 h-16 shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative hover:bg-gray-50 cursor-pointer">
                                {uploading ? <Icon icon="line-md:loading-loop" /> : <Icon icon="lucide:image-plus" className="text-gray-400" />}
                                <input type="file" disabled={uploading} onChange={(e)=>handleUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pt-2">
                            {form.videos.map((vid, i) => <div key={i} className="w-24 h-16 shrink-0 rounded-xl overflow-hidden border bg-black relative group"><video src={vid} className="w-full h-full object-cover" /><button type="button" onClick={()=>setForm({...form, videos: form.videos.filter((_, idx)=>idx!==i)})} className="absolute inset-0 bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><Icon icon="lucide:x" className="text-white" /></button></div>)}
                            <div className="w-24 h-16 shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative hover:bg-gray-50 cursor-pointer">
                                {uploading ? <Icon icon="line-md:loading-loop" /> : <><Icon icon="lucide:video" className="text-gray-400 mr-2 w-4 h-4" /><span className="text-[9px] font-bold uppercase text-gray-400">Add Video</span></>}
                                <input type="file" disabled={uploading} onChange={(e)=>handleUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 pt-6 border-t border-black/5 flex justify-end gap-4">
                    <button type="button" onClick={()=>setIsOpen(false)} className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-all text-xs">Discard</button>
                    <button type="submit" disabled={uploading} className="px-10 py-4 rounded-2xl font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-secondary transition-all shadow-xl text-xs flex items-center gap-2">
                        <Icon icon="lucide:save" className="w-4 h-4" /> Save Masterpiece
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
