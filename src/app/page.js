import HomeClient from './HomeClient';
import productData from '../data/products.json';
import prisma from '@/lib/prisma';

export const metadata = {
   title: "Shree Shyam Darshan (SSD) | India's Biggest Laddu Gopal Poshak Manufacturer",
   description: "Shree Shyam Darshan (SSD) - The leading manufacturer & wholesaler of Premium Laddu Gopal Poshaks, NDL, New Darshan Lace, and Divine Accessories in Surat. Best prices and worldwide delivery.",
   keywords: ["Laddu Gopal Poshak Wholesale", "SSD Poshak", "NDL Surat", "New Darshan Lace", "Deity Dresses Manufacturer", "Shringar Sets India", "Shree Shyam Darshan Surat"],
};

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
   // Fetch Dynamic Database Content with graceful fallback on DB downtime
   let products = [];
   let categories = [];
   let reviews = [];
   let reviewVideos = [];

   try {
      // 1. Fetch products & categories and videos in parallel for efficiency
      const [dbProducts, dbCategories] = await Promise.all([
         prisma.product.findMany({
            where: { isVisible: true, isBestSeller: true },
            take: 12,
            include: { category: true, subCategory: true },
            orderBy: { createdAt: 'desc' }
         }),
         prisma.category.findMany({ include: { subCategories: true }, orderBy: { createdAt: 'asc' } }),
         // prisma.reviewVideo.findMany({
         //    where: { isActive: true },
         //    orderBy: { createdAt: 'desc' }
         // }).catch(() => [])
      ]);

      // Happy Customer: User Review Videos
      reviewVideos = [
         { id: '1', url: 'https://ssd-video-server.vercel.app/customer-review-1.mp4', title: 'from Delhi' },
         { id: '2', url: 'https://ssd-video-server.vercel.app/customer-review-2.mp4', title: 'from Ahmedabad' }
      ];

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
         image: p.images[0] || "/images/hero.webp",
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
      products = (productData.products || [])
         .filter(p => p.isBestSeller)
         .slice(0, 12)
         .map(p => ({
            ...p,
            image: p.images?.[0] || p.image || "/images/hero.webp",
            images: p.images || [p.image || "/images/hero.webp"]
         }));

      categories = (productData.categories || []).map(c => ({
         id: c.id,
         name: c.label,
         label: c.label,
         image: c.image,
         subCategories: c.subCategories || []
      }));
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
          <HomeClient
             products={products}
             categories={categories}
             reviews={reviews}
             reviewVideos={reviewVideos}
          />
        </>
      );
}
