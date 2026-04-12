import prisma from "@/lib/prisma";
import WholesalerCollectionClient from "@/components/WholesalerCollectionClient";

export const metadata = {
  title: "Ready Stock | Immediate Dispatch",
  description: "B2B inventory available for immediate dispatch within 24 operational hours.",
};

export default async function ReadyStockCollectionPage() {
  const products = await prisma.product.findMany({
    where: {
      isReadyStock: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <WholesalerCollectionClient
      title="Ready-Stock"
      subtitle="Immediate Dispatch Collection"
      products={products}
      type="ready-stock"
    />
  );
}
