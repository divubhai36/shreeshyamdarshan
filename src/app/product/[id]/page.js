import ProductClient from "./ProductClient";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isVisible: true },
      select: { id: true },
      take: 100 // Pre-render top 100 products for instant loading
    });
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (err) {
    console.error("[Product] generateStaticParams error:", err?.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
      const dbProduct = await prisma.product.findUnique({ where: { id, isVisible: true } });
      if (dbProduct) {
          return {
            title: `${dbProduct.name} | Shree Shyam Darshan`,
            description: dbProduct.description || `${dbProduct.name}. Buy premium divine poshaks direct from factory.`,
            openGraph: {
              title: dbProduct.name,
              description: dbProduct.description,
              images: [{ url: dbProduct.images[0], width: 800, height: 600, alt: dbProduct.name }],
              type: 'website',
            },
            twitter: {
              card: 'summary_large_image',
              title: dbProduct.name,
              description: dbProduct.description,
              images: [dbProduct.images[0]],
            },
            alternates: { canonical: `/product/${id}` }
          };
      }
  } catch (err) {}

  return { title: "Product Not Found" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  try {
      const dbProduct = await prisma.product.findUnique({
          where: { id, isVisible: true },
          include: { category: true, subCategory: true, innerSubCategory: true }
      });

      if (dbProduct) {
         const relatedDbPool = await prisma.product.findMany({
             where: { subCategoryId: dbProduct.subCategoryId, id: { not: dbProduct.id }, isVisible: true },
             take: 20
         });
         const relatedDb = relatedDbPool.sort(() => 0.5 - Math.random()).slice(0, 10);

         const mappedProduct = {
             id: dbProduct.id,
             name: dbProduct.name,
             productId: dbProduct.productId,
             category: dbProduct.category?.name || "Unknown",
             subCategory: dbProduct.subCategory?.name || "Unknown",
             innerCategory: dbProduct.innerSubCategory?.name || null,
             price: dbProduct.price,
             description: dbProduct.description,
             image: dbProduct.images[0] || "/hero.png",
             images: dbProduct.images,
             videos: dbProduct.videos,
             isBestSeller: dbProduct.isBestSeller,
             isOfferProduct: dbProduct.isOfferProduct,
             offerPrice: dbProduct.offerPrice,
             showSizeGuide: dbProduct.showSizeGuide,
             showWashCare: dbProduct.showWashCare,
             details: dbProduct.details,
             wholesalerDescription: dbProduct.wholesalerDescription,
             variants: dbProduct.variants,
             mrp: dbProduct.mrp,
             discountPercent: dbProduct.discountPercent,
             unit: dbProduct.unit,
             isVisible: dbProduct.isVisible,
             allowToBuy: dbProduct.allowToBuy
         };

         const mappedRelated = relatedDb.map(p => ({
             id: p.id,
             name: p.name,
             price: p.price,
             offerPrice: p.offerPrice,
             isOfferProduct: p.isOfferProduct,
             category: dbProduct.category?.name || "Unknown",
             images: p.images,
             image: p.images[0] || "/hero.png"
         }));

         const navCat = { id: dbProduct.category.slug, name: dbProduct.category.name };
         const subCat = { id: dbProduct.subCategory.slug, name: dbProduct.subCategory.name };
         const innerSubCat = dbProduct.innerSubCategory ? { id: dbProduct.innerSubCategory.slug, name: dbProduct.innerSubCategory.name } : null;

         // Product JSON-LD
         const jsonLd = {
           "@context": "https://schema.org",
           "@type": "Product",
           "name": dbProduct.name,
           "image": dbProduct.images,
           "description": dbProduct.description,
           "sku": dbProduct.productId,
           "brand": { "@type": "Brand", "name": "Shree Shyam Darshan" },
           "offers": {
             "@type": "Offer",
             "url": `https://shreeshyamdarshan.com/product/${dbProduct.id}`,
             "priceCurrency": "INR",
             "price": dbProduct.offerPrice || dbProduct.price,
             "availability": "https://schema.org/InStock"
           }
         };

         return (
           <>
             <script
               type="application/ld+json"
               dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
             />
             <ProductClient product={mappedProduct} navCategory={navCat} subCategory={subCat} innerSubCategory={innerSubCat} relatedProducts={mappedRelated} />
           </>
         );
      }
  } catch(err) {}

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse text-brand-primary/20">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary mb-4">Product Not Found</h1>
      <p className="text-brand-primary/60 max-w-md mx-auto mb-10 leading-relaxed text-sm">
        This Product is currently unavailable. Please check back later or explore our other divine collections.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-10 py-5 bg-brand-primary text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/30 hover:bg-brand-secondary transition-all active:scale-95"
      >
        Continue Exploration
      </Link>
    </div>
  );
}
