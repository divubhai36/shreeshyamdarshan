import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';
import SmartImage from '@/components/SmartImage';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await prisma.blogPost.findUnique({ where: { slug } });

    if (!blog) return { title: "Blog Not Found" };

    return {
        title: `${blog.title} | Shree Shyam Darshan Blogs`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            images: [{ url: blog.image || "/og-image.jpg" }],
        }
    };
}

export async function generateStaticParams() {
    const blogs = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true }
    });
    return blogs.map(b => ({ slug: b.slug }));
}

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const blog = await prisma.blogPost.findUnique({
        where: { slug }
    });

    if (!blog) notFound();

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] lg:h-[70vh] bg-brand-primary overflow-hidden">
                <SmartImage 
                    src={blog.image || "/images/hero.webp"} 
                    alt={blog.title}
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-primary via-brand-primary/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20">
                    <div className="container mx-auto max-w-4xl">
                        <Link 
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-brand-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-8 hover:gap-4 transition-all"
                        >
                            <Icon icon="solar:arrow-left-bold-duotone" className="w-4 h-4" />
                            Back to Chronicles
                        </Link>
                        <p className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.4em] mb-4">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h1 className="text-4xl lg:text-6xl font-serif font-black text-white leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 max-w-4xl py-20">
                <div className="bg-brand-accent/50 rounded-[40px] p-8 lg:p-16 border border-brand-primary/5">
                    <div 
                        className="prose prose-brand lg:prose-xl max-w-none prose-p:text-brand-primary/70 prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-brand-primary prose-a:text-brand-secondary prose-img:rounded-3xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Footer / CTA */}
                <div className="mt-20 border-t border-brand-primary/5 pt-20 text-center">
                    <div className="w-20 h-20 bg-brand-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-primary/20">
                        <Icon icon="solar:heart-bold-duotone" className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-brand-primary mb-2">Divine Fashion, Direct to You</h3>
                    <p className="text-brand-primary/40 text-[10px] uppercase font-black tracking-widest mb-10">Follow our journey on social media</p>
                    <div className="flex justify-center gap-6">
                        <a href="https://www.instagram.com/shree.shyam.darshan_/" target="_blank" className="w-12 h-12 bg-white border border-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                            <Icon icon="solar:instagram-bold-duotone" className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
