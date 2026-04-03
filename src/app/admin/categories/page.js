"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../actions";
import Image from "next/image";

export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await getCategories();
    setData(res);
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
    if(editingId) {
      await updateCategory(editingId, form);
    } else {
      await createCategory(form);
    }
    setIsOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this category? All related items will be deleted too.")) {
      await deleteCategory(id);
      loadData();
    }
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl });
    setIsOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", imageUrl: "" });
    setIsOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-primary">Category Management</h1>
          <p className="text-xs font-bold text-brand-secondary tracking-widest uppercase">Manage main collections</p>
        </div>
        <button onClick={openNew} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all flex items-center gap-2">
          <Icon icon="lucide:plus" className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Icon icon="line-md:loading-loop" className="w-8 h-8 text-brand-secondary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-brand-primary/5 overflow-hidden group">
              <div className="h-40 relative bg-brand-primary/5">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Icon icon="lucide:image" className="w-10 h-10 text-brand-primary/20" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 shadow-sm hover:scale-110 transition-transform"><Icon icon="lucide:edit-2" className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-600 shadow-sm hover:scale-110 transition-transform"><Icon icon="lucide:trash-2" className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-primary truncate">{cat.name}</h3>
                <p className="text-[10px] text-brand-primary/40 font-mono mt-1">/{cat.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-primary font-serif">{editingId ? 'Edit' : 'Create'} Category</h2>
              <button onClick={() => setIsOpen(false)} className="text-brand-primary/40 hover:text-red-500"><Icon icon="lucide:x" className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-brand-primary/60">Name</label>
                <input type="text" value={form.name} onChange={handleNameChange} className="w-full p-3 border rounded-xl mt-1 focus:border-brand-secondary outline-none" required />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-brand-primary/60">Slug (URL Route)</label>
                <input type="text" value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} className="w-full p-3 border rounded-xl mt-1 font-mono text-sm bg-gray-50 outline-none" required />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-brand-primary/60 block mb-1">Image cover (Optimized by Cloudinary)</label>
                {form.imageUrl && <div className="mb-2"><img src={form.imageUrl} className="w-32 h-32 object-cover rounded-xl border" /></div>}
                <div className="relative border-2 border-dashed border-brand-primary/20 rounded-xl p-4 text-center hover:bg-brand-primary/5 transition-colors cursor-pointer">
                  {uploading ? <Icon icon="line-md:loading-loop" className="w-6 h-6 mx-auto text-brand-secondary" /> : (
                    <>
                      <Icon icon="lucide:upload-cloud" className="w-6 h-6 mx-auto text-brand-primary/40" />
                      <span className="text-xs text-brand-primary/60 mt-2 block font-medium">Click to upload new image</span>
                    </>
                  )}
                  <input type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={uploading} />
                </div>
              </div>
              <button type="submit" disabled={uploading} className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-6 hover:bg-brand-secondary transition-colors">
                {editingId ? 'Update' : 'Create'} Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
