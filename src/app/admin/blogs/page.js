"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../actions/blogActions';

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        isPublished: true
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getBlogs();
            setBlogs(data);
        } catch (err) {
            toast.error("Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBlog) {
                await updateBlog(editingBlog.id, formData);
                toast.success("Blog updated");
            } else {
                await createBlog(formData);
                toast.success("Blog created");
            }
            setIsModalOpen(false);
            setEditingBlog(null);
            setFormData({ title: '', slug: '', excerpt: '', content: '', image: '', isPublished: true });
            loadData();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteBlog(id);
            toast.success("Blog deleted");
            loadData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image || '',
            isPublished: blog.isPublished
        });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-serif font-black text-brand-primary">Divine Chronicles</h1>
                    <p className="text-[10px] font-black text-brand-secondary tracking-[0.4em] uppercase mt-1">SEO Content Engine</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingBlog(null);
                        setFormData({ title: '', slug: '', excerpt: '', content: '', image: '', isPublished: true });
                        setIsModalOpen(true);
                    }}
                    className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-brand-secondary transition-all flex items-center gap-3"
                >
                    <Icon icon="solar:add-circle-bold-duotone" className="w-5 h-5" />
                    New Article
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Icon icon="line-md:loading-loop" className="w-10 h-10 text-brand-secondary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white border border-brand-primary/5 rounded-[32px] p-6 flex items-center justify-between group hover:shadow-xl transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl overflow-hidden">
                                    <img src={blog.image || '/images/hero.webp'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-primary">{blog.title}</h3>
                                    <p className="text-[10px] text-brand-primary/40 uppercase tracking-widest mt-1">/{blog.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleEdit(blog)} className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all">
                                    <Icon icon="solar:pen-new-square-bold-duotone" className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(blog.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/20 backdrop-blur-md">
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-serif font-bold text-brand-primary mb-8">{editingBlog ? 'Edit' : 'Create'} Article</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Title</label>
                                <input 
                                    className="w-full bg-brand-primary/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:border-brand-secondary transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Slug (URL)</label>
                                <input 
                                    className="w-full bg-brand-primary/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:border-brand-secondary transition-all"
                                    value={formData.slug}
                                    onChange={e => setFormData({...formData, slug: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Excerpt (SEO Summary)</label>
                                <textarea 
                                    className="w-full bg-brand-primary/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:border-brand-secondary transition-all h-24"
                                    value={formData.excerpt}
                                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Content (HTML allowed)</label>
                                <textarea 
                                    className="w-full bg-brand-primary/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:border-brand-secondary transition-all h-64 font-mono text-sm"
                                    value={formData.content}
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Image URL</label>
                                <input 
                                    className="w-full bg-brand-primary/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:border-brand-secondary transition-all"
                                    value={formData.image}
                                    onChange={e => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-6">
                                <button type="submit" className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg">Save Article</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
