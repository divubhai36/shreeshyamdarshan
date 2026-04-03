import HomeClient from './HomeClient';
import productData from '../data/products.json';
import prisma from '@/lib/prisma';

export const metadata = {
   title: "India's Biggest Manufacturer of Divine Poshaks",
   description: "Shree Shyam Darshan is the leading manufacturer of Laddu Gopal Poshaks, Shringar sets, and Divine Accessories in Surat, India. Worldwide delivery available.",
};

export default async function Home() {
   // 1. Fetch Dynamic Database Content
   const dbProducts = await prisma.product.findMany({ 
      include: { category: true, subCategory: true },
      orderBy: { createdAt: 'desc' }
   });
   const dbCategories = await prisma.category.findMany({ include: { subCategories: true } });

   // 2. Map Database to Front-end Schema
   let products = dbProducts.map(p => ({
     id: p.id,
     name: p.name,
     category: p.category?.name || "Unknown",
     price: p.price,
     description: p.description,
     image: p.images[0] || "/hero.png",
     isBestSeller: p.isBestSeller
   }));
   
   let categories = dbCategories.map(c => ({
     id: c.slug,
     name: c.name,
     label: c.name,
     image: c.imageUrl,
     subCategories: c.subCategories || []
   }));

   // 3. Graceful Fallback Strategy (Keeps old flow alive until Admin adds products)
   // --- FALLBACK SUSPENDED BY USER ---
   /*
   if (products.length === 0) products = productData.products;
   if (categories.length === 0) categories = productData.categories;
   */
   
   return <HomeClient products={products} categories={categories} />;
}
