import SubCategoryClient from "./SubCategoryClient";
import productData from "../../../../data/products.json";
import navigationData from "../../../../data/navigation.json";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { categoryId, subCategoryId } = await params;
  
  const dbSub = await prisma.subCategory.findUnique({ where: { slug: subCategoryId }, include: { category: true } });
  if (dbSub) {
     return {
        title: `${dbSub.name} - ${dbSub.category.name}`,
        description: `Buy premium ${dbSub.name} for ${dbSub.category.name}.`,
        alternates: { canonical: `/category/${categoryId}/${subCategoryId}` }
     };
  }

  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const cat = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
  const sub = cat?.subCategories.find(s => s.id.toLowerCase() === subCategoryId?.toLowerCase());
  if (!sub) return { title: "Subcategory Not Found" };
  return {
    title: `${sub.name} - ${cat.name}`,
    description: `Buy premium ${sub.name} for ${cat.name}.`,
    alternates: { canonical: `/category/${categoryId}/${subCategoryId}` }
  };
  */

  return { title: "Subcategory Not Found" };
}

export default async function SubCategoryPage({ params }) {
  const { categoryId, subCategoryId } = await params;
  
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
       subCategoryId={dbSub.slug}
     />;
  }
  
  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const category = navigationData.find(c => c.id.toLowerCase() === categoryId?.toLowerCase());
  if (!category) return <div>Category Not Found</div>;
  const subCategory = category.subCategories.find(s => s.id.toLowerCase() === subCategoryId?.toLowerCase());
  if (!subCategory) return <div>Subcategory Not Found</div>;
  
  const products = productData.products.filter(p => {
    const pCat = p.category.toLowerCase();
    const subName = subCategory.name.toLowerCase();
    const subId = subCategory.id.toLowerCase().replace(/-/g, " ");
    return pCat.includes(subName) || pCat.includes(subId);
  });

  return <SubCategoryClient category={category} subCategory={subCategory} products={products} categoryId={categoryId} subCategoryId={subCategoryId} />;
  */

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse text-brand-primary/20">
        <Icon icon="solar:layers-broken" className="w-12 h-12" />
      </div>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4">Collection unavailable</h1>
      <p className="text-brand-primary/60 max-w-md mx-auto mb-10 leading-relaxed text-sm">
        The curated selection you're looking for is currently being re-modeled. Explore our other divine categories in the meantime.
      </p>
      <a 
        href="/" 
        className="inline-flex items-center justify-center px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all active:scale-95"
      >
        Return to Gallery
      </a>
    </div>
  );
}
