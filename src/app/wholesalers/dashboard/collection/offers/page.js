import prisma from "@/lib/prisma";
import WholesalerCollectionClient from "@/components/WholesalerCollectionClient";

export const metadata = {
  title: "Discount Offers | Wholesaler Treasury",
  description: "Exclusive B2B offers and volume-based incentives for our authorized wholesalers.",
};

export default async function OffersCollectionPage() {
  const products = await prisma.product.findMany({
    where: {
      isOfferProduct: true,
      isVisible: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <WholesalerCollectionClient
      title="Discount Offer"
      subtitle="Exclusive B2B Margins"
      products={products}
      type="offers"
    />
  );
}
