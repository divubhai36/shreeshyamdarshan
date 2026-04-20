"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../actions";
import Image from "next/image";
import toast from "react-hot-toast";


export default function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", videos: [] });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // { file, preview, status }



  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await getCategories();
    setData(res);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await res.json();
      if(upData.url) {
        setForm({ ...form, imageUrl: upData.url });
        toast.success("Cover Image Ready");
      }
    } catch(err) { toast.error("Asset upload failed"); }

    setUploadingImage(false);
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentCount = form.videos.length + uploadQueue.length;
    const remainingSlots = 8 - currentCount;

    if (remainingSlots <= 0) {
      toast.error("Cap reached: Maximum 8 visual assets allowed");
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
       toast.error(`Auto-truncated selection: only ${remainingSlots} slots empty`);
    }


    // 1. Create temporary preview objects for immediate feedback
    const newItems = filesToUpload.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setUploadQueue(prev => [...prev, ...newItems]);

    // 2. Process uploads one by one to ensure sequence
    const uploadedUrls = [];
    for (let i = 0; i < newItems.length; i++) {
      const currentItem = newItems[i];

      const fd = new FormData();
      fd.append("file", currentItem.file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await res.json();

        if(upData.url) {
          uploadedUrls.push(upData.url);
          // Mark as done in queue
          setUploadQueue(prev => prev.map(item =>
            item.preview === currentItem.preview ? { ...item, status: 'done' } : item
          ));
        }
      } catch(err) {
        toast.error("Cinema reel failed to upload");
      }
    }


    // 3. Finalize by adding all successful URLs to form
    const updatedVideos = [...form.videos, ...uploadedUrls];
    setForm(prev => ({ ...prev, videos: updatedVideos }));

    // 5. Auto-update if editing
    if (editingId && uploadedUrls.length > 0) {
      const updatedForm = { ...form, videos: updatedVideos };
      try {
        await updateCategory(editingId, updatedForm);
        toast.success("Collection Auto-Saved");
      } catch (err) {
        toast.error("Sync failed");
      }
    }


    // 4. Cleanup queue
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(item => item.status !== 'done'));
    }, 1000);
  };





  const removeVideo = (index) => {
    setForm({ ...form, videos: form.videos.filter((_, i) => i !== index) });
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
      toast.success("Collection Refined Successfully");
    } else {
      await createCategory(form);
      toast.success("New Collection Launched");
    }

    setIsOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this category? All related items will be deleted too.")) {
      await deleteCategory(id);
      toast.success("Architectural components removed");
      loadData();
    }

  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl,
      videos: cat.videos || []
    });
    setIsOpen(true);
  };


  const openNew = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", imageUrl: "", videos: [] });
    setIsOpen(true);
  };


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Categories</h1>
          <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Categories Management</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative group w-full sm:w-64">
            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/20 w-4 h-4 group-focus-within:text-brand-secondary transition-colors" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-primary/5 rounded-xl p-3 pl-11 text-[11px] font-bold text-brand-primary focus:ring-4 focus:ring-brand-secondary/5 transition-all outline-none shadow-sm placeholder:text-brand-primary/20 tracking-wider"
            />

          </div>
          <button suppressHydrationWarning onClick={openNew} className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all flex items-center gap-2 h-fit whitespace-nowrap shadow-lg">

            <Icon icon="lucide:plus" className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Icon icon="line-md:loading-loop" className="w-8 h-8 text-brand-secondary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((cat) => (
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brand-primary/50 backdrop-blur-md p-4">

          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-primary/5">
              <div>
                <h2 className="text-xl font-bold text-brand-primary font-serif">{editingId ? 'Refine' : 'Architect'} Collection</h2>
                <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">Configure layout and media</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary/5 text-brand-primary/40 hover:text-red-500 hover:bg-red-50 transition-colors"><Icon icon="lucide:x" className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Image */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-[0.15em] text-brand-primary block mb-1.5 flex justify-between items-center">
                      Collection Name
                      <span className="text-[10px] font-normal italic lowercase">Publicly visible title</span>
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="e.g. Royal Silk Collection"
                      className="w-full p-3 bg-brand-primary/5 border border-transparent rounded-xl focus:bg-white focus:border-brand-secondary outline-none transition-all text-xs font-bold text-brand-primary"
                      required
                    />

                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-black tracking-[0.15em] text-brand-primary mb-1.5 flex justify-between items-center">
                      Cover Asset
                      <span className="text-[10px] font-normal italic lowercase">Recommended: 16:9 Landscape</span>
                    </label>
                    <div className="relative group aspect-2/1 bg-brand-primary/5 rounded-2xl overflow-hidden border-2 border-dashed border-brand-primary/10 hover:border-brand-secondary/50 transition-colors">

                      {form.imageUrl ? (
                        <img src={form.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-primary/20">
                          <Icon icon="solar:gallery-upload-bold-duotone" className="w-10 h-10 mb-1" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Main Backdrop</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-brand-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        {uploadingImage ? (
                          <Icon icon="line-md:loading-loop" className="w-6 h-6 text-white" />
                        ) : (
                          <div className="bg-white text-brand-primary px-4 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-widest shadow-xl">
                            {form.imageUrl ? 'Replace' : 'Upload Image'}
                          </div>
                        )}
                      </div>
                      <input suppressHydrationWarning type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={uploadingImage} />

                    </div>
                  </div>


                  <div className="p-6 bg-brand-primary/5 rounded-[32px] border border-brand-primary/5">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-primary/60 mb-3 flex items-center gap-2">
                       <Icon icon="solar:info-square-bold-duotone" className="w-4 h-4 text-brand-secondary" />
                       Design Requirements
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-[10px] text-brand-primary/60 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-brand-secondary" />
                        Cover images should be landscape (16:9)
                      </li>
                      <li className="text-[10px] text-brand-primary/60 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-brand-secondary" />
                        Reels should be portrait (9:16) for best mobile impact
                      </li>
                    </ul>
                </div>
                </div>

                {/* Right Column: Video Gallery */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-10px uppercase font-black tracking-0.15em text-brand-primary">Cinema Reels (Portrait)</label>

                      <div className="flex items-center gap-2">
                         {form.videos.length < 3 && <span className="text-[10px] font-bold text-amber-600 animate-pulse">Min. 3 required for Cinema mode</span>}
                         <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-md leading-none">{form.videos.length} Active</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3 min-h-[160px] content-start overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                      {/* Active Videos */}
                      {form.videos.map((vid, idx) => (
                        <div key={`v-${idx}`} className="relative aspect-9/16 bg-black rounded-lg overflow-hidden border border-brand-primary/10 group shadow-md">

                          <video src={vid} autoPlay muted loop className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeVideo(idx)}
                            className="absolute top-1 right-1 bg-white/20 backdrop-blur-md text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"
                          >
                            <Icon icon="lucide:trash-2" className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      {/* Upload Queue Previews */}
                      {uploadQueue.map((item, idx) => (
                        <div key={`q-${idx}`} className="relative aspect-9/16 bg-brand-primary/10 rounded-lg overflow-hidden border border-brand-secondary/30 group animate-pulse">

                          <video src={item.preview} muted loop className="w-full h-full object-cover opacity-40" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Icon icon="line-md:loading-loop" className="w-5 h-5 text-brand-secondary" />
                          </div>
                        </div>
                      ))}

                      {/* Add Box */}
                      {(form.videos.length + uploadQueue.length) < 8 && (
                        <div className="relative aspect-9/16 border-2 border-dashed border-brand-primary/10 rounded-lg flex flex-col items-center justify-center hover:bg-brand-primary/5 hover:border-brand-secondary/50 transition-all cursor-pointer group">

                          <Icon icon="solar:video-library-bold-duotone" className="w-6 h-6 text-brand-primary/20 group-hover:text-brand-secondary transition-colors" />
                          <span className="text-[7px] font-bold uppercase tracking-wider text-brand-primary/40 mt-1 text-center">Add Reels</span>
                          <input suppressHydrationWarning type="file" onChange={handleVideoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="video/*" multiple disabled={uploadQueue.length > 0} />

                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                     <Icon icon="solar:info-circle-bold-duotone" className="w-5 h-5 text-amber-600 shrink-0" />
                     <p className="text-[8px] text-amber-600 font-medium leading-normal italic">Limit reached: 8 videos Max. Random rotation active after 3 reels.</p>
                  </div>

                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-primary/5 flex items-center justify-between">
                 <p className="text-[8px] font-medium text-brand-primary tracking-wider uppercase">Premium Collection</p>
                 <div className="flex gap-2">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] text-brand-primary/60 hover:bg-brand-primary/5 transition-all outline-none">Cancel</button>
                    <button
                      suppressHydrationWarning
                      type="submit"
                      disabled={uploadingImage || uploadQueue.length > 0}
                      className="px-10 py-3.5 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg hover:bg-brand-secondary hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2 outline-none"
                    >

                      <Icon icon="solar:check-read-bold-duotone" className="w-4 h-4" />
                      {editingId ? 'Update Collection' : 'Launch Category'}
                    </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
