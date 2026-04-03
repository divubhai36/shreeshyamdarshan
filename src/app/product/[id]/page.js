import ProductClient from "./ProductClient";
import productData from "../../../data/products.json";
import navigationData from "../../../data/navigation.json";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
      const dbProduct = await prisma.product.findUnique({ where: { id } });
      if (dbProduct) {
          return {
            title: dbProduct.name,
            description: `${dbProduct.name}. Buy premium divine poshaks direct from factory.`,
            openGraph: { title: dbProduct.name, description: dbProduct.description, images: [dbProduct.images[0]] },
            alternates: { canonical: `/product/${id}` }
          };
      }
  // eslint-disable-next-line no-empty
  } catch (err) {}

  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const product = productData.products.find((p) => String(p.id) === id);
  if (!product) return { title: "ProducCinematic Qualityt Not Found" };
  return {
    title: product.name,
    alternates: { canonical: `/product/${id}` },
  };
  */

  return { title: "Product Not Found" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  try {
      const dbProduct = await prisma.product.findUnique({
          where: { id },
          include: { category: true, subCategory: true }
      });

      if (dbProduct) {
         // Gather up to 10 related products from the same subcategory
         const relatedDb = await prisma.product.findMany({
             where: { subCategoryId: dbProduct.subCategoryId, id: { not: dbProduct.id } },
             take: 10
         });

         const mappedProduct = {
             id: dbProduct.id,
             name: dbProduct.name,
             category: dbProduct.category?.name || "Unknown",
             price: dbProduct.price,
             description: dbProduct.description,
             image: dbProduct.images[0] || "/hero.png", // Hero image map
             images: dbProduct.images, // Full array map
             videos: dbProduct.videos, // Full array map
             isBestSeller: dbProduct.isBestSeller
         };

         const mappedRelated = relatedDb.map(p => ({
             id: p.id,
             name: p.name,
             price: p.price,
             image: p.images[0] || "/hero.png"
         }));

         const navCat = { id: dbProduct.category.slug, name: dbProduct.category.name };
         const subCat = { id: dbProduct.subCategory.slug, name: dbProduct.subCategory.name };

         return <ProductClient product={mappedProduct} navCategory={navCat} subCategory={subCat} relatedProducts={mappedRelated} />;
      }
  // eslint-disable-next-line no-empty
  } catch(err) {}

  // --- FALLBACK SUSPENDED BY USER ---
  /*
  const product = productData.products.find((p) => String(p.id) === id);
  if (!product) return <div>Product Not Found</div>;

  const navCategory = navigationData.find((c) => c.subCategories.some((sub) => sub.name.toLowerCase() === product.category.toLowerCase() || sub.id.toLowerCase() === product.category.toLowerCase()));
  const subCategory = navCategory?.subCategories.find((sub) => sub.name.toLowerCase() === product.category.toLowerCase() || sub.id.toLowerCase() === product.category.toLowerCase());
  const relatedProducts = productData.products.filter((p) => p.id !== product.id && (p.category === product.category || (navCategory && p.category === navCategory.id))).slice(0, 10);

  return <ProductClient product={product} navCategory={navCategory} subCategory={subCategory} relatedProducts={relatedProducts} />;
  */

  return <div className="text-center py-40 font-bold text-2xl font-serif">Product not found in Database</div>;
}
