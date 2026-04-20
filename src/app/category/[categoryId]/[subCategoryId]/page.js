import SubCategoryClient from "./SubCategoryClient";
import prisma from "@/lib/prisma";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cache } from "react";

export const revalidate = 3600; // Revalidate every hour

const getSubCategoryData = cache(async (subCategoryId) => {
  try {
    return await prisma.subCategory.findUnique({
      where: { slug: subCategoryId },
      include: {
         category: true,
         innerSubCategories: true,
         products: {
            where: { isVisible: true },
            include: { category: true }
         }
      }
    });
  } catch (err) {
    console.error("[SubCategory] getSubCategoryData error:", err?.message);
    return null;
  }
});

export async function generateStaticParams() {
   try {
      const subCategories = await prisma.subCategory.findMany({
         include: { category: true }
      });
      return subCategories.map((sub) => ({
         categoryId: sub.category.slug,
         subCategoryId: sub.slug,
      }));
   } catch (err) {
      console.error("[SubCategory] generateStaticParams error:", err?.message);
      return [];
   }
}

export async function generateMetadata({ params }) {
   const { subCategoryId } = await params;

   if (!subCategoryId) return { title: "Subcategory Not Found" };

   try {
      const dbSub = await getSubCategoryData(subCategoryId);
      if (dbSub) {
         return {
            title: `${dbSub.name} - ${dbSub.category.name}`,
            description: `Buy premium ${dbSub.name} for ${dbSub.category.name}.`,
            alternates: { canonical: `/category/${dbSub.category.slug}/${subCategoryId}` }
         };
      }
   } catch (error) {
       console.error("Metadata fetch error:", error);
   }

   return { title: "Subcategory Not Found" };
}

export default async function SubCategoryPage({ params }) {
   const { categoryId, subCategoryId } = await params;

   if (!categoryId || !subCategoryId) {
       return <div>Missing parameters</div>;
   }

   try {
       const dbSub = await getSubCategoryData(subCategoryId);

       if (dbSub && dbSub.category.slug === categoryId) {
          const mappedProducts = dbSub.products.map(p => ({
             id: p.id,
             name: p.name,
             category: p.category?.name || "Unknown",
             price: p.price,
             description: p.description,
             images: p.images,
             image: p.images[0] || "/hero.png",
             isBestSeller: p.isBestSeller,
             isOfferProduct: p.isOfferProduct,
             offerPrice: p.offerPrice,
             innerSubId: p.innerSubId
          }));

          return (
             <SubCategoryClient
                category={{ 
                   id: dbSub.category.slug, 
                   name: dbSub.category.name, 
                   image: dbSub.category.imageUrl 
                }}
                subCategory={{
                   id: dbSub.slug,
                   name: dbSub.name,
                   image: dbSub.imageUrl,
                   sections: dbSub.innerSubCategories.map(ic => ({
                      id: ic.slug,
                      dbId: ic.id,
                      name: ic.name,
                      image: ic.imageUrl || dbSub.imageUrl
                   }))
                }}
                products={mappedProducts}
                categoryId={dbSub.category.slug}
             />
          );
       }
   } catch (err) {
       console.error("SubCategoryPage error:", err);
   }

   return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
         <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse text-brand-primary/20">
            <Icon icon="solar:layers-broken" className="w-12 h-12" />
         </div>
         <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4">Collection unavailable</h1>
         <p className="text-brand-primary/60 max-w-md mx-auto mb-10 leading-relaxed text-sm">
            The curated selection you're looking for is currently being re-modeled. Explore our other divine categories in the meantime.
         </p>
         <Link
            href="/"
            className="inline-flex items-center justify-center px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all active:scale-95"
         >
            Return to Gallery
         </Link>
      </div>
   );
}

