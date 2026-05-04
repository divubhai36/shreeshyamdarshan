"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../actions";
import { deleteFromAllAccounts } from "@/lib/cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

import { useCloudinary } from "@/hooks/useCloudinary";
import { compressAndResizeImage } from "@/lib/imageProcessor";

export default function Categories() {
  const { uploadToAllAccounts, uploading } = useCloudinary();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", videos: [] });

  // States for "Upload on Submit"
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pendingVideos, setPendingVideos] = useState([]); // { file, preview }
  const [deletedMedia, setDeletedMedia] = useState([]); // Track IDs to delete on save



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

    try {
      const processed = await compressAndResizeImage(file, 'category');
      setSelectedFile(processed.file);
      setImagePreview(processed.preview);
      // toast.success(`Image Optimized (${processed.reduction} smaller)`);
    } catch (err) {
      toast.error("Image processing failed");
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 5MB Limit check
    const maxSize = 5 * 1024 * 1024;
    const oversized = files.find(f => f.size > maxSize);
    if (oversized) {
      toast.error(`"${oversized.name}" is too large! Max 5MB allowed.`);
      return;
    }

    const currentCount = form.videos.length + pendingVideos.length;
    const remainingSlots = 8 - currentCount;

    if (remainingSlots <= 0) {
      toast.error("Cap reached: Maximum 8 visual assets allowed");
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const newItems = filesToProcess.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPendingVideos(prev => [...prev, ...newItems]);
    toast.success(`${newItems.length} videos queued for upload`);
  };





  const removeVideo = (index) => {
    const vid = form.videos[index];
    if (vid && vid.startsWith('shree')) {
      setDeletedMedia(prev => [...prev, { id: vid, type: 'video' }]);
    }
    setForm({ ...form, videos: form.videos.filter((_, i) => i !== index) });
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
      // 1. Upload Cover Image if selected
      if (selectedFile) {
        toast.loading("Uploading Cover Image...", { id: 'upload' });
        // If we are editing and replacing an image, track the old one for deletion
        if (editingId && form.imageUrl) {
          setDeletedMedia(prev => [...prev, { id: form.imageUrl, type: 'image' }]);
        }
        const uploaded = await uploadToAllAccounts(selectedFile, 'image');
        currentForm.imageUrl = uploaded.public_id;
      }

      // 2. Upload Pending Videos
      if (pendingVideos.length > 0) {
        toast.loading(`Uploading ${pendingVideos.length} Videos...`, { id: 'upload' });
        const videoUrls = [];
        for (const item of pendingVideos) {
          const uploaded = await uploadToAllAccounts(item.file, 'video');
          videoUrls.push(uploaded.public_id);
        }
        currentForm.videos = [...currentForm.videos, ...videoUrls];
      }

      toast.loading("Finalizing Registry...", { id: 'upload' });

      const itemsToDelete = [...deletedMedia];
      if (editingId) {
        await updateCategory(editingId, currentForm);
        if (itemsToDelete.length > 0) {
          // Split deletion by type
          const imagesToDelete = itemsToDelete.filter(m => m.type === 'image').map(m => m.id);
          const videosToDelete = itemsToDelete.filter(m => m.type === 'video').map(m => m.id);

          if (imagesToDelete.length > 0) await deleteFromAllAccounts(imagesToDelete, 'image');
          if (videosToDelete.length > 0) await deleteFromAllAccounts(videosToDelete, 'video');
        }
        toast.success("Collection Refined Successfully", { id: 'upload' });
      } else {
        await createCategory(currentForm);
        toast.success("New Collection Launched", { id: 'upload' });
      }

      setIsOpen(false);
      setSelectedFile(null);
      setImagePreview("");
      setPendingVideos([]);
      loadData();
    } catch (err) {
      toast.error("Sync failed. Media was not saved.", { id: 'upload' });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category? All related items will be deleted too.")) {
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
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Icon icon="line-md:loading-loop" className="w-12 h-12 text-brand-secondary" />
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-primary/30">Loading Categories...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {(() => {
            const filteredData = data.filter(cat =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredData.length === 0) {
              return (
                <div className="text-center py-32 opacity-20">
                  <Icon icon="solar:layers-broken" className="w-20 h-20 mx-auto mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">No Categories Added</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-brand-primary/5 overflow-hidden group">
                    <div className="h-40 relative bg-brand-primary/5">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${cat.imageUrl}` : cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
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
            );
          })()}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-brand-primary/50 backdrop-blur-md p-4">

          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-primary/5">
              <div>
                <h2 className="text-xl font-bold text-brand-primary font-serif">{editingId ? 'Edit Category' : 'Add Category'}</h2>
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
                      Category Name
                      <span className="text-[10px] font-normal italic lowercase">Publicly visible title</span>
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter Category Name"
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

                      {imagePreview || form.imageUrl ? (
                        <img src={imagePreview || (form.imageUrl.startsWith('shree') ? `https://res.cloudinary.com/dumbddcvh/image/upload/${form.imageUrl}` : form.imageUrl)} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-primary/20">
                          <Icon icon="solar:gallery-upload-bold-duotone" className="w-10 h-10 mb-1" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Main Backdrop</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-brand-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        {uploading ? (
                          <Icon icon="line-md:loading-loop" className="w-6 h-6 text-white" />
                        ) : (
                          <div className="bg-white text-brand-primary px-4 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-widest shadow-xl">
                            {form.imageUrl || imagePreview ? 'Replace' : 'Upload Image'}
                          </div>
                        )}
                      </div>
                      <input suppressHydrationWarning type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={uploading} />

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
                      <label className="text-[10px] uppercase font-black tracking-0.15em text-brand-primary flex items-center gap-2">
                         Cinema Reels (Portrait) <span className="text-red-500 font-medium">- Max 5MB</span>
                      </label>

                      <div className="flex items-center gap-2">
                        {/* {form.videos.length < 3 && <span className="text-[10px] font-bold text-amber-600 animate-pulse">Min. 3 required for Cinema mode</span>} */}
                        <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-md leading-none">{form.videos.length} Active</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3 min-h-[160px] content-start overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                      {/* Active Videos */}
                      {form.videos.map((vid, idx) => (
                        <div key={`v-${idx}`} className="relative aspect-9/16 bg-black rounded-lg overflow-hidden border border-brand-primary/10 group shadow-md">

                          <video src={vid.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${vid}` : vid} autoPlay muted loop className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeVideo(idx)}
                            className="absolute top-1 right-1 bg-white/20 backdrop-blur-md text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"
                          >
                            <Icon icon="lucide:trash-2" className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      {/* Pending Videos (selected but not uploaded) */}
                      {pendingVideos.map((item, idx) => (
                        <div key={`p-${idx}`} className="relative aspect-9/16 bg-brand-primary/10 rounded-lg overflow-hidden border border-brand-secondary/30 group">
                          <video src={item.preview} muted loop className="w-full h-full object-cover opacity-60" />
                          <button
                            type="button"
                            onClick={() => setPendingVideos(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-white/20 backdrop-blur-md text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"
                          >
                            <Icon icon="lucide:x" className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Box */}
                      {(form.videos.length + pendingVideos.length) < 8 && (
                        <div className="relative aspect-9/16 border-2 border-dashed border-brand-primary/10 rounded-lg flex flex-col items-center justify-center hover:bg-brand-primary/5 hover:border-brand-secondary/50 transition-all cursor-pointer group">

                          <Icon icon="solar:video-library-bold-duotone" className="w-6 h-6 text-brand-primary/20 group-hover:text-brand-secondary transition-colors" />
                          <span className="text-[7px] font-bold uppercase tracking-wider text-brand-primary/40 mt-1 text-center">Add Reels</span>
                          <input suppressHydrationWarning type="file" onChange={handleVideoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="video/*" multiple disabled={uploading} />

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
                    disabled={uploading}
                    className="px-10 py-3.5 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg hover:bg-brand-secondary hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2 outline-none"
                  >

                    {uploading ? (
                      <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                    ) : (
                      <Icon icon="solar:check-read-bold-duotone" className="w-4 h-4" />
                    )}
                    {uploading ? 'Uploading...' : (editingId ? 'Update Collection' : 'Launch Category')}
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
