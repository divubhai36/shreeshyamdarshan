import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      categories, subCategories, products, pendingReviews,
      totalWholesalers, activeWholesalers,
      recentOrders, allOrders, recentWholesalers,
      pendingOrders, dispatchedOrders, completedOrders,
      offerProducts, readyStockProducts,
    ] = await Promise.all([
      prisma.category.count(),
      prisma.subCategory.count(),
      prisma.product.count({ where: { isVisible: true } }),
      prisma.review.count({ where: { status: 'PENDING' } }),

      prisma.wholesaler.count(),
      prisma.wholesaler.count({ where: { isActive: true } }),

      // Last 5 orders for activity feed
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { wholesaler: { select: { name: true, companyName: true } } }
      }),

      // All orders for revenue calculation
      prisma.order.findMany({
        select: { totalAmount: true, status: true, createdAt: true }
      }),

      // Last 4 new wholesalers
      prisma.wholesaler.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, companyName: true, phone: true, createdAt: true, isActive: true }
      }),

      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DISPATCHED' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),

      prisma.product.count({ where: { isOfferProduct: true, isVisible: true } }),
      prisma.product.count({ where: { isReadyStock: true, isVisible: true } }),
    ]);

    // Revenue calculations
    const totalRevenue = allOrders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthlyRevenue = allOrders
      .filter(o => o.status !== 'CANCELLED' && new Date(o.createdAt) >= thisMonth)
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      categories,
      subCategories,
      products,
      offerProducts,
      readyStockProducts,
      reviews: pendingReviews,
      totalWholesalers,
      activeWholesalers,
      pendingOrders,
      dispatchedOrders,
      completedOrders,
      totalOrders: allOrders.length,
      totalRevenue: Math.round(totalRevenue),
      monthlyRevenue: Math.round(monthlyRevenue),
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
        wholesalerName: o.wholesaler?.companyName || o.wholesaler?.name || 'Unknown',
      })),
      recentWholesalers,
    }, { status: 200 });

  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
