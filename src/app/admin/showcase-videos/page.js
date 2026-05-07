"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getShowcaseVideos, createShowcaseVideo, deleteShowcaseVideo } from "../actions";
import toast from "react-hot-toast";
import { useCloudinary } from "@/hooks/useCloudinary";

export default function ShowcaseVideosPage() {
  const { uploadToAllAccounts, uploading: isCloudSyncing } = useCloudinary();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "", url: "" });
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "link"

  // Local states for "Upload on Submit"
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await getShowcaseVideos();
      setData(res);
    } catch (err) {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5MB Limit check
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large! Maximum size allowed is 5MB.");
      e.target.value = "";
      return;
    }

    // Local preview only
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url && !selectedFile) return toast.error("Please provide a video URL or upload one");

    let currentForm = { ...form };

    try {
      if (selectedFile) {
        toast.loading("Uploading Reel...", { id: 'reel' });
        const res = await uploadToAllAccounts(selectedFile, 'video');
        currentForm.url = res.public_id;
      }

      toast.loading("Adding to Showcase...", { id: 'reel' });
      await createShowcaseVideo(currentForm);
      toast.success("Showcase video added", { id: 'reel' });
      setIsOpen(false);
      setForm({ title: "", url: "" });
      setSelectedFile(null);
      setPreviewUrl("");
      loadData();
    } catch (err) {
      toast.error("Failed to add video. Sync error.", { id: 'reel' });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this video from showcase?")) {
      try {
        await deleteShowcaseVideo(id);
        toast.success("Video removed");
        loadData();
      } catch (err) {
        toast.error("Failed to delete video");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-primary">Video Gallery</h1>
          <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-2 opacity-60">Cinematic Showcase Management</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: "", url: "" });
            setPreviewUrl("");
            setActiveTab("upload");
            setIsOpen(true);
          }}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all flex items-center gap-2 h-fit whitespace-nowrap shadow-lg"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" /> Add Showcase Video
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Icon icon="line-md:loading-loop" className="w-8 h-8 text-brand-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((video) => (
            <div key={video.id} className="bg-white rounded-3xl shadow-sm border border-brand-primary/5 overflow-hidden group relative aspect-[9/16]">
              <video
                src={video.url.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${video.url}` : video.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
                <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-2 truncate">{video.title || "Untitled Reel"}</p>
                <div className="flex flex-col gap-2">
                  <div className="truncate text-[7px] text-white/40 mb-1">{video.url}</div>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500 backdrop-blur-md text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                  >
                    Delete Reel
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full py-20 text-center bg-brand-primary/5 rounded-[40px] border-2 border-dashed border-brand-primary/10">
              <Icon icon="solar:videocamera-record-bold-duotone" className="w-16 h-16 text-brand-primary/10 mx-auto mb-4" />
              <p className="text-brand-primary/40 font-serif italic">No showcase videos added yet.</p>
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/50 backdrop-blur-md p-4">
          <div className="bg-white max-w-md w-full max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-primary/5 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-brand-primary font-serif">Add New Reel</h2>
                <p className="text-[9px] text-brand-secondary font-bold uppercase tracking-widest">Cinematic Showcase</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary/5 text-brand-primary/40 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-[9px] uppercase font-black tracking-[0.15em] text-brand-primary block mb-1.5 leading-none">Video Title (Optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Handwork Detail"
                  className="w-full p-3 bg-brand-primary/5 border border-transparent rounded-xl focus:bg-white focus:border-brand-secondary outline-none transition-all text-xs font-bold text-brand-primary"
                />
              </div>

              <div className="space-y-4">
                <div className="flex p-1 bg-brand-primary/5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "upload" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/40"}`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("link")}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "link" ? "bg-white text-brand-primary shadow-sm" : "text-brand-primary/40"}`}
                  >
                    Direct Link
                  </button>
                </div>

                {activeTab === "upload" ? (
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-[0.15em] text-brand-primary mb-1.5 block leading-none">
                      Upload portrait reel (9:16) <span className="font-medium text-red-500 ml-1">- Max 5MB</span>
                    </label>
                    <div className="relative group aspect-[9/16] bg-brand-primary/5 rounded-2xl overflow-hidden border-2 border-dashed border-brand-primary/10 hover:border-brand-secondary/50 transition-colors max-w-[180px] mx-auto">
                      {(previewUrl || form.url) && activeTab === "upload" ? (
                        <div className="relative w-full h-full">
                           <video src={previewUrl || (form.url.startsWith('shree') ? `https://res.cloudinary.com/duxn4yj3a/video/upload/f_auto,q_auto/${form.url}` : form.url)} className={`w-full h-full object-cover ${isCloudSyncing ? 'opacity-40' : ''}`} autoPlay muted loop key={previewUrl || form.url} />
                           {isCloudSyncing && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                                 <Icon icon="line-md:loading-loop" className="w-10 h-10 text-white mb-2" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">Uploading...</span>
                              </div>
                           )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-primary/20 p-4 text-center">
                          <Icon icon="solar:video-library-bold-duotone" className="w-10 h-10 mb-2" />
                          <span className="text-[8px] font-bold uppercase tracking-widest leading-tight">Drop file here</span>
                        </div>
                      )}

                      {!isCloudSyncing && (
                        <div className="absolute inset-0 bg-brand-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-white text-brand-primary px-4 py-1.5 rounded-full font-bold text-[8px] uppercase tracking-widest shadow-xl">
                            {form.url || previewUrl ? 'Replace' : 'Upload'}
                          </div>
                        </div>
                      )}
                      <input type="file" onChange={handleVideoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="video/*" disabled={isCloudSyncing} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-[0.15em] text-brand-primary block mb-1.5 leading-none">Direct Video URL</label>
                    <input
                      type="url"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      className="w-full p-3 bg-brand-primary/5 border border-transparent rounded-xl focus:bg-white focus:border-brand-secondary outline-none transition-all text-xs font-bold text-brand-primary"
                    />
                    <p className="text-[8px] text-brand-primary/40 mt-2 italic font-medium tracking-wide">Enter a direct MP4/external link (e.g. from Cloudinary/G-Drive direct link)</p>

                    {form.url && activeTab === "link" && (
                       <div className="mt-4 aspect-[9/16] bg-black rounded-2xl overflow-hidden max-w-[180px] mx-auto">
                          <video src={form.url} className="w-full h-full object-cover" autoPlay muted loop key={form.url} />
                       </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] text-brand-primary/60 hover:bg-brand-primary/5 transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCloudSyncing || (!form.url && !selectedFile)}
                  className="flex-3 py-3.5 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Icon icon="solar:check-read-bold-duotone" className="w-4 h-4" />
                  {isCloudSyncing ? 'Uploading...' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
