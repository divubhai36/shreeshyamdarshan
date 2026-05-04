"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getInnerSubCategories, createInnerSubCategory, updateInnerSubCategory, deleteInnerSubCategory, getSubCategories } from "../actions";
import CustomSelect from "@/components/CustomSelect";
import toast from "react-hot-toast";

import { useCloudinary } from "@/hooks/useCloudinary";
import { compressAndResizeImage } from "@/lib/imageProcessor";

export default function InnerSubcategoryPage() {
  const { uploadToAllAccounts, uploading: isCloudSyncing } = useCloudinary();
  const [data, setData] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", subCategoryId: "" });

  // States for "Upload on Submit"
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [dRes, subRes] = await Promise.all([getInnerSubCategories(), getSubCategories()]);
    setData(dRes);
    setSubs(subRes);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    /*
    try {
      const processed = await compressAndResizeImage(file, 'category');
      setSelectedFile(processed.file);
      setImagePreview(processed.preview);
      // toast.success(`Image Optimized`);
    } catch(err) {
      toast.error("Processing failed");
    }
    */
  };

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val, slug: slugify(val) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentForm = { ...form };

    try {
      /*
      if (selectedFile) {
        toast.loading("Uploading...", { id: 'sync' });
        const uploaded = await uploadToAllAccounts(selectedFile);
        currentForm.imageUrl = uploaded.public_id;
      }
      */

      toast.loading("Finalizing...", { id: 'sync' });
      if(editingId) {
        await updateInnerSubCategory(editingId, currentForm);
        toast.success("Inner Category Refined", { id: 'sync' });
      } else {
        await createInnerSubCategory(currentForm);
        toast.success("Inner Category Created", { id: 'sync' });
      }
      setIsOpen(false);
      setSelectedFile(null);
      setImagePreview("");
      loadData();
    } catch (err) {
      toast.error("Operation failed", { id: 'sync' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Inner Categories</h1>
          <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Inner Categories Management</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative group w-full sm:w-64">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
            />

          </div>
          <button suppressHydrationWarning onClick={() => { setEditingId(null); setForm({ name: "", slug: "", imageUrl: "", subCategoryId: subs[0]?.id || "" }); setIsOpen(true); }} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all whitespace-nowrap shadow-lg flex items-center gap-2">

            <Icon icon="lucide:plus" className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary" />
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-primary/30">Loading Inner-Categories...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {(() => {
            const filteredData = data.filter(inner =>
               inner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               inner.subCategory?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               inner.subCategory?.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredData.length === 0) {
              return (
                <div className="text-center py-32 opacity-20">
                  <Icon icon="solar:layers-broken" className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">No Inner-Categories Added</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredData.map((inner) => (
                  <div key={inner.id} className="group relative bg-white p-6 rounded-[32px] border border-brand-primary/5 hover:border-brand-secondary/20 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)]">
                    <div className="aspect-square w-full bg-brand-primary/[0.03] rounded-2xl overflow-hidden mb-5 relative group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center">
                      {inner.imageUrl ? (
                        <img src={inner.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${inner.imageUrl}` : inner.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl font-serif font-bold text-brand-primary/20 tracking-tighter">
                          {inner.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div>
                      <h3 className="font-bold text-brand-primary text-base truncate pr-14">{inner.name}</h3>
                      <p className="text-[9px] font-black text-brand-secondary/40 uppercase tracking-[0.2em] mt-1 italic">{inner.subCategory?.name} → {inner.subCategory?.category?.name}</p>
                    </div>

                    <div className="absolute top-8 right-8 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button onClick={() => { setEditingId(inner.id); setForm({name: inner.name, slug: inner.slug, imageUrl: inner.imageUrl, subCategoryId: inner.subCategoryId}); setIsOpen(true); }} className="w-9 h-9 bg-white/90 backdrop-blur-md text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all">
                        <Icon icon="solar:pen-new-square-bold-duotone" className="w-5 h-5" />
                      </button>
                      <button onClick={async () => { if(confirm("Delete this?")) { await deleteInnerSubCategory(inner.id); toast.success("Removed"); loadData(); } }} className="w-9 h-9 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Premium Modal for forms */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/40 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-[48px] p-8 md:p-12 shadow-2xl relative my-auto border border-white/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all">
              <Icon icon="lucide:x" className="w-6 h-6 text-brand-primary/40" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Edit' : 'Add'} Inner Category</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-secondary/40 mt-2">Link with Sub Category</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-3 block ml-1 text-brand-primary/30 group-focus-within:text-brand-secondary transition-colors">Parent Sub-Category</label>
                  <CustomSelect
                    placeholder="Search sub categories..."
                    options={subs.map(s => ({ value: s.id, label: `${s.name} (${s.category.name})` }))}
                    value={form.subCategoryId}
                    onChange={(val) => setForm({ ...form, subCategoryId: val })}
                    isSearchable={true}
                    className="!rounded-[24px]"
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-3 block ml-1 text-brand-primary/30 group-focus-within:text-brand-secondary transition-colors">Inner Category Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    className="w-full p-5 bg-brand-primary/[0.02] border border-brand-primary/5 rounded-[24px] font-serif font-bold text-lg text-brand-primary outline-none focus:border-brand-secondary/40 focus:bg-white transition-all placeholder:text-brand-primary/10"
                    placeholder="Enter Inner category name"
                    required
                  />
                </div>

                {/* 
                  <div className="p-4 rounded-[32px] border-2 border-dashed border-brand-primary/5 group hover:border-brand-secondary/20 transition-all bg-brand-primary/[0.01]">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-4 block text-center text-brand-primary/30">Image Preview</label>
                    <div className="flex flex-col items-center gap-6">
                      {imagePreview || form.imageUrl ? (
                        <div className="relative group/img aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                          <img src={imagePreview || (form.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${form.imageUrl}` : form.imageUrl)} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => { setForm({...form, imageUrl: ""}); setSelectedFile(null); setImagePreview(""); }} className="bg-white/90 p-3 rounded-2xl text-red-500 font-bold text-xs flex items-center gap-2">
                               <Icon icon="solar:refresh-linear" /> Replace Entry
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full h-32 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white rounded-2xl transition-all border border-transparent hover:border-brand-primary/5">
                          <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary/40 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:cloud-upload-bold-duotone" className="w-6 h-6" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary/40">Select Aesthetic Image</span>
                          <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
                        </label>
                      )}
                      {isCloudSyncing && (
                        <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                          <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                */}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={()=>setIsOpen(false)} className="flex-1 h-16 rounded-[24px] font-black text-[10px] uppercase tracking-widest text-brand-primary/40 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={isCloudSyncing} className="flex-1 h-16 bg-brand-primary text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    {isCloudSyncing && <Icon icon="line-md:loading-loop" className="w-5 h-5" />}
                    Confirm Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
