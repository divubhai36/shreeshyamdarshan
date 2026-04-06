import CollectionsClient from "./CollectionsClient";
import productData from "../../../data/products.json";
import navigationData from "../../../data/navigation.json";
import prisma from "@/lib/prisma";

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
        const count = await prisma.product.count({ where: { subCategoryId: sub.id } });
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

  return <div className="text-center py-40 font-bold text-2xl font-serif">Category not found in Database</div>;
}
