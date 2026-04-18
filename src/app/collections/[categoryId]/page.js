import CollectionsClient from "./CollectionsClient";
import prisma from "@/lib/prisma";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true }
  });

  return categories.map((cat) => ({
    categoryId: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { categoryId } = await params;

  // Try DB first
  const dbCat = await prisma.category.findUnique({ where: { slug: categoryId } });
  if (dbCat) {
    return {
      title: `${dbCat.name} Collection`,
      description: `Explore our exclusive ${dbCat.name} collection at Shree Shyam Darshan.`,
      openGraph: { title: `${dbCat.name} Collection`, images: [dbCat.imageUrl] },
      alternates: { canonical: `/collections/${categoryId}` }
    };
  }

  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const navCategory = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
  const productCategory = productData.categories.find(c => c.id === categoryId);
  const category = navCategory || productCategory;
  if (!category) return { title: "Collection Not Found" };
  const name = category.name || category.label;
  return {
    title: `${name} Collection`,
    description: `Explore our exclusive ${name} collection.`,
    alternates: { canonical: `/collections/${categoryId}` }
  };
  */

  return { title: "Collection Not Found" };
}

export default async function CollectionsPage({ params }) {
  const { categoryId } = await params;

  // Try DB First
  const dbCategory = await prisma.category.findUnique({
    where: { slug: categoryId },
    include: { subCategories: true }
  });

  if (dbCategory) {
     const subCategoriesData = await Promise.all(dbCategory.subCategories.map(async (sub) => {
        const count = await prisma.product.count({ where: { subCategoryId: sub.id, isVisible: true } });
        return {
           id: sub.slug,
           name: sub.name,
           image: sub.imageUrl || dbCategory.imageUrl,
           productCount: count
        };
     }));

     const proxyCategory = {
       id: dbCategory.slug,
       name: dbCategory.name,
       label: dbCategory.name,
       image: dbCategory.imageUrl,
       videos: dbCategory.videos
     };


     return <CollectionsClient category={proxyCategory} categoryId={dbCategory.slug} subCategories={subCategoriesData} />;
  }

  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const navCategory = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
  const productCategory = productData.categories.find(c => c.id === categoryId);
  const category = navCategory || productCategory;
  if (!category) return <div>Collection Not Found</div>;

  const subCategoriesData = (category.subCategories || []).map((sub) => {
    const subName = typeof sub === "string" ? sub : sub.name;
    const subId = typeof sub === "string" ? sub : sub.id;
    const subImage = typeof sub === "string" ? category.image : sub.image || category.image;
    const productCount = productData.products.filter(p => {
      const pCat = p.category.toLowerCase();
      return pCat.includes(subName.toLowerCase()) || pCat.includes(subId.toLowerCase().replace(/-/g, " "));
    }).length;
    return { id: subId, name: subName, image: subImage, productCount };
  });

  return <CollectionsClient category={category} categoryId={categoryId} subCategories={subCategoriesData} />;
  */

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse text-brand-primary/20">
        <Icon icon="solar:folder-error-bold-duotone" className="w-12 h-12" />
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4">Registry Entry Missing</h1>
      <p className="text-brand-primary/60 max-w-md mx-auto mb-10 leading-relaxed text-sm">
        We couldn't locate this specific registry entry in our master catalog. Our curators may be updating the collection.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all active:scale-95"
      >
        Back to Master Catalog
      </Link>
    </div>
  );
}
