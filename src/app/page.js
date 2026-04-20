import HomeClient from './HomeClient';
import productData from '../data/products.json';
import prisma from '@/lib/prisma';

export const metadata = {
   title: "India's Biggest Manufacturer of Divine Poshaks",
   description: "Shree Shyam Darshan is the leading manufacturer of Laddu Gopal Poshaks, Shringar sets, and Divine Accessories in Surat, India. Worldwide delivery available.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
   // Fetch Dynamic Database Content with graceful fallback on DB downtime
   let products = [];
   let categories = [];
   let reviews = [];

   try {
      // 1. Fetch products & categories in parallel
      const [dbProducts, dbCategories] = await Promise.all([
         prisma.product.findMany({
            where: { isVisible: true, isBestSeller: true },
            take: 12,
            include: { category: true, subCategory: true },
            orderBy: { createdAt: 'desc' }
         }),
         prisma.category.findMany({ include: { subCategories: true } })
      ]);

      // 2. Map DB → front-end schema
      products = dbProducts.map(p => ({
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

      categories = dbCategories.map(c => ({
         id: c.slug,
         name: c.name,
         label: c.name,
         image: c.imageUrl,
         subCategories: c.subCategories || []
      }));

      // 3. Fetch approved reviews
      try {
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
      } catch (reviewErr) {
         console.warn("[Home] Could not fetch reviews:", reviewErr?.message);
      }

   } catch (dbErr) {
      console.error("[Home] DB unreachable, falling back to static data:", dbErr?.message);
      // Fallback: use local JSON so the page still renders
      products = productData
         .filter(p => p.isBestSeller)
         .slice(0, 12)
         .map(p => ({ ...p, image: p.images?.[0] || p.image || "/hero.png" }));
   }
    
    // SEO Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Shree Shyam Darshan",
      "url": "https://shreeshyamdarshan.com",
      "logo": "https://shreeshyamdarshan.com/logo.png",
      "description": "India's Biggest Manufacturer of Divine Poshaks and Accessories.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "addressCountry": "India"
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HomeClient products={products} categories={categories} reviews={reviews} />
      </>
    );
}
