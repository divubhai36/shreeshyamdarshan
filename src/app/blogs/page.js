import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import SmartImage from '@/components/SmartImage';
import BlogHeader from './BlogHeader';

export const revalidate = 3600;

export const metadata = {
    title: "Divine Stories & Poshak Insights | Shree Shyam Darshan Blogs",
    description: "Explore the latest insights on Laddu Gopal Poshaks, Shringar care, and divine heritage stories by Shree Shyam Darshan (SSD).",
    keywords: ["Laddu Gopal Blog", "Poshak Care Tips", "SSD Stories", "Divine Fashion Insights", "Surat Poshak Industry"],
};

export default async function BlogsPage() {
    const blogs = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-brand-accent pb-20">
            {/* Header */}
            <BlogHeader />

            <div className="container mx-auto px-4 max-w-6xl -mt-12 relative z-20">
                {blogs.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center shadow-xl shadow-brand-primary/5">
                        <Icon icon="solar:notes-minimalistic-bold-duotone" className="w-20 h-20 text-brand-primary/10 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-brand-primary mb-2 text-center w-full">Our Curators are Preparing Content</h2>
                        <p className="text-brand-primary/40 text-xs uppercase font-black tracking-widest text-center w-full">Divine stories will appear here soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link 
                                href={`/blogs/${blog.slug}`} 
                                key={blog.id}
                                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-primary/5 flex flex-col"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <SmartImage 
                                        src={blog.image || "/images/hero.webp"} 
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-brand-primary/80 backdrop-blur-md text-white text-[8px] font-black uppercase px-4 py-2 rounded-full tracking-widest">
                                        SSD Insight
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <p className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.2em] mb-3">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <h2 className="text-xl font-serif font-bold text-brand-primary mb-4 leading-tight group-hover:text-brand-secondary transition-colors">
                                        {blog.title}
                                    </h2>
                                    <p className="text-[11px] text-brand-primary/50 font-medium leading-relaxed mb-8 line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all">
                                        <span>Read Story</span>
                                        <Icon icon="solar:arrow-right-up-bold-duotone" className="ml-2 w-4 h-4 text-brand-secondary" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
