import SubCategoryClient from "./SubCategoryClient";
import prisma from "@/lib/prisma";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
   const subCategories = await prisma.subCategory.findMany({
      include: { category: true }
   });

   return subCategories.map((sub) => ({
      categoryId: sub.category.slug,
      subCategoryId: sub.slug,
   }));
}

export async function generateMetadata({ params }) {
   const { categoryId, subCategoryId } = await params;

   if (!subCategoryId) return { title: "Subcategory Not Found" };

   try {
      const dbSub = await prisma.subCategory.findUnique({ 
         where: { slug: subCategoryId }, 
         include: { category: true } 
      });
      if (dbSub) {
         return {
            title: `${dbSub.name} - ${dbSub.category.name}`,
            description: `Buy premium ${dbSub.name} for ${dbSub.category.name}.`,
            alternates: { canonical: `/category/${categoryId}/${subCategoryId}` }
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
       const dbCat = await prisma.category.findUnique({ where: { slug: categoryId } });
       const dbSub = await prisma.subCategory.findUnique({ where: { slug: subCategoryId } });

       if (dbCat && dbSub) {
      const dbProducts = await prisma.product.findMany({
         where: { subCategoryId: dbSub.id, isVisible: true },
         include: { category: true }
      });

      const dbInnerCats = await prisma.innerSubCategory.findMany({
         where: { subCategoryId: dbSub.id }
      });

      const mappedProducts = dbProducts.map(p => ({
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

      return <SubCategoryClient
         category={{ id: dbCat.slug, name: dbCat.name, image: dbCat.imageUrl }}
         subCategory={{
            id: dbSub.slug,
            name: dbSub.name,
            image: dbSub.imageUrl,
            sections: dbInnerCats.map(ic => ({
               id: ic.slug,
               dbId: ic.id,
               name: ic.name,
               image: ic.imageUrl || dbSub.imageUrl // Fallback to subcat image
            }))
         }}
         products={mappedProducts}
         categoryId={dbCat.slug}
         />;
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
