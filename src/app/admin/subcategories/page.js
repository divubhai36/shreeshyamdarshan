"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory, getCategories } from "../actions";
import CustomSelect from "@/components/admin/CustomSelect";

export default function SubcategoryPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", categoryId: "" });
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await res.json();
      if(upData.url) setForm({ ...form, imageUrl: upData.url });
    } catch(err) { alert("Upload failed"); }
    setUploading(false);
  };

  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val, slug: slugify(val) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editingId) await updateSubCategory(editingId, form);
    else await createSubCategory(form);
    setIsOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this Sub-category? Products inside may be broken.")) {
      await deleteSubCategory(id);
      loadData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Sub-categories</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase mt-1">Manage intermediate collections</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative group w-full sm:w-64">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
            />
          </div>
          <button onClick={() => { setEditingId(null); setForm({ name: "", slug: "", imageUrl: "", categoryId: categories[0]?.id || "" }); setIsOpen(true); }} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all whitespace-nowrap shadow-lg flex items-center gap-2">
            <Icon icon="lucide:plus" className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? <div className="text-center py-20"><Icon icon="line-md:loading-loop" className="w-8 h-8 text-brand-secondary mx-auto" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.filter(sub =>
             sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             sub.category.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((sub) => (
            <div key={sub.id} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-primary/5 relative group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-brand-primary/5">
                  {sub.imageUrl && <img src={sub.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-primary truncate">{sub.name}</h3>
                  <p className="text-[9px] text-brand-secondary uppercase tracking-widest font-bold">Category: {sub.category.name}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all bg-white shadow-lg p-1 rounded-full">
                <button onClick={() => { setEditingId(sub.id); setForm({name: sub.name, slug: sub.slug, imageUrl: sub.imageUrl, categoryId: sub.categoryId}); setIsOpen(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full"><Icon icon="lucide:edit" className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"><Icon icon="lucide:trash" className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6">
            <h2 className="text-xl font-bold font-serif mb-6">{editingId ? 'Edit' : 'Create'} Sub-category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest mb-1 block ml-1 text-brand-primary/40">Parent Category</label>
                <CustomSelect
                  placeholder="Select Master Category..."
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                  value={form.categoryId}
                  onChange={(val) => setForm({ ...form, categoryId: val })}
                  isSearchable={true}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest">Name</label>
                <input type="text" value={form.name} onChange={handleNameChange} className="w-full p-3 border rounded-xl mt-1" required />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest mb-1 block">Image</label>
                <input type="file" onChange={handleUpload} className="w-full text-xs" accept="image/*" />
                {uploading && <span className="text-xs text-blue-500">Uploading to Cloudinary...</span>}
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={()=>setIsOpen(false)} className="flex-1 bg-gray-100 p-3 rounded-xl font-bold">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-brand-primary text-white p-3 rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
