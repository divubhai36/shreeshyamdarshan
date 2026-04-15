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
      where: { isVisible: true },
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
     offerPrice: p.offerPrice,
     isOfferProduct: p.isOfferProduct,
     mrp: p.mrp,
     description: p.description,
     images: p.images,
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

    // 4. Fetch Approved Reviews
    let reviews = [];
    if (prisma.review) {
      const dbReviews = await prisma.review.findMany({
        where: { status: 'APPROVED' },
        include: { wholesaler: true },
        orderBy: { createdAt: 'desc' }
      });

      reviews = dbReviews.map(r => ({
        id: r.id,
        name: r.wholesaler?.name || r.dummyName || "Customer",
        company: r.wholesaler?.companyName || r.dummyCompany || "Verified Buyer",
        comment: r.comment,
        rating: r.rating
      }));
    }
    
    return <HomeClient products={products} categories={categories} reviews={reviews} />;
}
