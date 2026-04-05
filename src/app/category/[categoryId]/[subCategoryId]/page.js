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
         where: { subCategoryId: dbSub.id }, 
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
       image: p.images[0] || "/hero.png", 
       isBestSeller: p.isBestSeller,
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

  return <div className="text-center py-40 font-bold text-2xl font-serif">Sub-category not found in Database</div>;
}
