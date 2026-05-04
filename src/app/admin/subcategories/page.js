"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory, getCategories } from "../actions";
import CustomSelect from "@/components/CustomSelect";
import toast from "react-hot-toast";

import { useCloudinary } from "@/hooks/useCloudinary";
import { compressAndResizeImage } from "@/lib/imageProcessor";

export default function SubcategoryPage() {
  const { uploadToAllAccounts, uploading: isCloudSyncing } = useCloudinary();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", categoryId: "" });

  // Local states for "Upload on Submit"
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [subRes, catRes] = await Promise.all([getSubCategories(), getCategories()]);
    setData(subRes);
    setCategories(catRes);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const processed = await compressAndResizeImage(file, 'category'); // Using 'category' size for subcats
      setSelectedFile(processed.file);
      setImagePreview(processed.preview);
      // toast.success(`Image Optimized (${processed.reduction} smaller)`);
    } catch (err) {
      toast.error("Image processing failed");
    }
  };

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val, slug: slugify(val) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl && !selectedFile) {
      toast.error("Image is mandatory");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please assign a parent category");
      return;
    }

    let currentForm = { ...form };

    try {
      if (selectedFile) {
        toast.loading("Uploading...", { id: 'sync' });
        const uploaded = await uploadToAllAccounts(selectedFile);
        currentForm.imageUrl = uploaded.public_id;
      }

      toast.loading("Recording Registry...", { id: 'sync' });
      if (editingId) {
        await updateSubCategory(editingId, currentForm);
        toast.success("Sub-category Refined", { id: 'sync' });
      } else {
        await createSubCategory(currentForm);
        toast.success("Sub-category Created", { id: 'sync' });
      }
      setIsOpen(false);
      setSelectedFile(null);
      setImagePreview("");
      loadData();
    } catch (err) {
      toast.error("Operation failed. Sync interrupted.", { id: 'sync' });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Confirm removal? This may affect product visibility for entries in this registry.")) {
      await deleteSubCategory(id);
      toast.success("Registry Record Removed");
      loadData();
    }
  };

  // Group subcategories by category
  const filteredSubs = data.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = categories.map(cat => ({
    ...cat,
    subCategories: filteredSubs.filter(sub => sub.categoryId === cat.id)
  })).filter(group => group.subCategories.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Sub Categories</h1>
          <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Sub Categories Management</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative group w-full sm:w-80">
            <Icon icon="solar:magnifer-linear" className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Filter by name or parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-[20px] p-5 pl-12 text-[11px] font-bold text-brand-primary focus:ring-8 focus:ring-brand-secondary/5 transition-all outline-none shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] placeholder:text-brand-primary/20 tracking-wider"
            />
          </div>
          <button suppressHydrationWarning onClick={() => { setEditingId(null); setForm({ name: "", slug: "", imageUrl: "", categoryId: categories[0]?.id || "" }); setIsOpen(true); }} className="bg-brand-primary text-white h-14 px-10 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:shadow-2xl hover:bg-brand-secondary transition-all shadow-xl flex items-center gap-3 active:scale-95">
            <Icon icon="lucide:plus" className="w-4 h-4" /> New Entry
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary" />
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-primary/30">Loading Sub-Categories...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {groupedData.length === 0 ? (
            <div className="text-center py-32 opacity-20">
              <Icon icon="solar:layers-broken" className="w-20 h-20 mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">No Sub-Categories Added</p>
            </div>
          ) : groupedData.map((group) => (
            <div key={group.id} className="space-y-6">
              <div className="flex items-center gap-4 border-b border-brand-primary/5 pb-4">
                <div className="w-1.5 h-6 bg-brand-secondary rounded-full" />
                <h2 className="text-lg font-serif font-black text-brand-primary flex items-center gap-2">
                  {group.name}
                  <span className="text-[10px] font-sans font-black bg-brand-primary/5 text-brand-primary/40 px-3 py-1 rounded-full uppercase tracking-widest ml-2">
                    {group.subCategories.length} Units
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.subCategories.map((sub) => (
                  <div key={sub.id} className="group relative bg-white p-6 rounded-[32px] border border-brand-primary/5 hover:border-brand-secondary/20 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)]">
                    <div className="aspect-square w-full bg-brand-accent/30 rounded-2xl overflow-hidden mb-5 relative group-hover:scale-[1.02] transition-transform duration-500">
                      {sub.imageUrl ? (
                        <img src={sub.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${sub.imageUrl}` : sub.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-brand-primary/10">
                          <Icon icon="solar:image-broken-bold" className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div>
                      <h3 className="font-bold text-brand-primary text-base truncate pr-14">{sub.name}</h3>
                      <p className="text-[9px] font-black text-brand-secondary/40 uppercase tracking-[0.2em] mt-1 italic">{sub.slug}</p>
                    </div>

                    <div className="absolute top-8 right-8 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button onClick={() => { setEditingId(sub.id); setForm({ name: sub.name, slug: sub.slug, imageUrl: sub.imageUrl, categoryId: sub.categoryId }); setIsOpen(true); }} className="w-9 h-9 bg-white/90 backdrop-blur-md text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all">
                        <Icon icon="solar:pen-new-square-bold-duotone" className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="w-9 h-9 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all">
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/40 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-[48px] p-8 md:p-12 shadow-2xl relative my-auto border border-white/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all">
              <Icon icon="lucide:x" className="w-6 h-6 text-brand-primary/40" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-serif font-bold text-brand-primary">{editingId ? 'Edit' : 'Add'} Sub-Category</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-secondary/40 mt-2">Intermediate Registry Form</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-3 block ml-1 text-brand-primary/30 group-focus-within:text-brand-secondary transition-colors">Parent Category</label>
                  <CustomSelect
                    placeholder="Search master categories..."
                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                    value={form.categoryId}
                    onChange={(val) => setForm({ ...form, categoryId: val })}
                    isSearchable={true}
                    className="!rounded-[24px]"
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-3 block ml-1 text-brand-primary/30 group-focus-within:text-brand-secondary transition-colors">Sub category Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    className="w-full p-5 bg-brand-primary/[0.02] border border-brand-primary/5 rounded-[24px] font-serif font-bold text-lg text-brand-primary outline-none focus:border-brand-secondary/40 focus:bg-white transition-all placeholder:text-brand-primary/10"
                    placeholder="Enter Sub-category name"
                    required
                  />
                </div>

                <div className="p-4 rounded-[32px] border-2 border-dashed border-brand-primary/5 group hover:border-brand-secondary/20 transition-all bg-brand-primary/[0.01]">
                  <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-4 block text-center text-brand-primary/30">Image Preview</label>
                  <div className="flex flex-col items-center gap-6">
                    {imagePreview || form.imageUrl ? (
                      <div className="relative group/img aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
                        <img src={imagePreview || (form.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${form.imageUrl}` : form.imageUrl)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => { setForm({ ...form, imageUrl: "" }); setSelectedFile(null); setImagePreview(""); }} className="bg-white/90 p-3 rounded-2xl text-red-500 font-bold text-xs flex items-center gap-2">
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
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 h-16 rounded-[24px] font-black text-[10px] uppercase tracking-widest text-brand-primary/40 hover:bg-gray-50 transition-all">Cancel</button>
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
