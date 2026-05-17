"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { roundToTwo } from "@/lib/utils";
import { deleteFromAllAccounts } from "@/lib/cloudinary";

// Category Actions
export async function getCategories() { return await prisma.category.findMany({ orderBy: { createdAt: 'asc' } }); }
export async function createCategory(data) { await prisma.category.create({ data }); revalidatePath('/admin/categories'); revalidatePath('/', 'layout'); }
export async function updateCategory(id, data) { 
  const oldItem = await prisma.category.findUnique({ where: { id } });
  if (oldItem?.imageUrl && data.imageUrl && oldItem.imageUrl !== data.imageUrl) {
    await deleteFromAllAccounts(oldItem.imageUrl, 'image');
  }
  if (oldItem?.videos && data.videos) {
    const removedVideos = oldItem.videos.filter(v => !data.videos.includes(v));
    if (removedVideos.length > 0) await deleteFromAllAccounts(removedVideos, 'video');
  }
  await prisma.category.update({ where: { id }, data }); 
  revalidatePath('/admin/categories'); 
  revalidatePath('/', 'layout');
}
export async function deleteCategory(id) { 
  const item = await prisma.category.findUnique({ where: { id } });
  if (item?.imageUrl) await deleteFromAllAccounts(item.imageUrl, 'image');
  if (item?.videos?.length > 0) await deleteFromAllAccounts(item.videos, 'video');
  await prisma.category.delete({ where: { id } }); 
  revalidatePath('/admin/categories'); 
  revalidatePath('/', 'layout');
}
export async function swapCategoryOrder(id1, id2) {
  const cat1 = await prisma.category.findUnique({ where: { id: id1 } });
  const cat2 = await prisma.category.findUnique({ where: { id: id2 } });
  if (cat1 && cat2) {
    const temp = cat1.createdAt;
    await prisma.$transaction([
      prisma.category.update({ where: { id: id1 }, data: { createdAt: cat2.createdAt } }),
      prisma.category.update({ where: { id: id2 }, data: { createdAt: temp } }),
    ]);
    revalidatePath('/admin/categories');
    revalidatePath('/', 'layout');
  }
}

// Subcategory Actions
export async function getSubCategories() { return await prisma.subCategory.findMany({ include: { category: true }, orderBy: { id: 'asc' } }); }
export async function createSubCategory(data) { await prisma.subCategory.create({ data }); revalidatePath('/admin/subcategories'); revalidatePath('/', 'layout'); }
export async function updateSubCategory(id, data) { 
  const oldItem = await prisma.subCategory.findUnique({ where: { id } });
  if (oldItem?.imageUrl && data.imageUrl && oldItem.imageUrl !== data.imageUrl) {
    await deleteFromAllAccounts(oldItem.imageUrl, 'image');
  }
  await prisma.subCategory.update({ where: { id }, data }); 
  revalidatePath('/admin/subcategories'); 
  revalidatePath('/', 'layout');
}
export async function deleteSubCategory(id) { 
  const item = await prisma.subCategory.findUnique({ where: { id } });
  if (item?.imageUrl) await deleteFromAllAccounts(item.imageUrl, 'image');
  await prisma.subCategory.delete({ where: { id } }); 
  revalidatePath('/admin/subcategories'); 
  revalidatePath('/', 'layout');
}

// InnerSubcategory Actions
export async function getInnerSubCategories() { return await prisma.innerSubCategory.findMany({ include: { subCategory: { include: { category: true } } }, orderBy: { id: 'asc' } }); }
export async function createInnerSubCategory(data) { await prisma.innerSubCategory.create({ data }); revalidatePath('/admin/inner-subcategories'); revalidatePath('/', 'layout'); }
export async function updateInnerSubCategory(id, data) { 
  const oldItem = await prisma.innerSubCategory.findUnique({ where: { id } });
  if (oldItem?.imageUrl && data.imageUrl && oldItem.imageUrl !== data.imageUrl) {
    await deleteFromAllAccounts(oldItem.imageUrl, 'image');
  }
  await prisma.innerSubCategory.update({ where: { id }, data }); 
  revalidatePath('/admin/inner-subcategories'); 
  revalidatePath('/', 'layout');
}
export async function deleteInnerSubCategory(id) { 
  const item = await prisma.innerSubCategory.findUnique({ where: { id } });
  if (item?.imageUrl) await deleteFromAllAccounts(item.imageUrl, 'image');
  await prisma.innerSubCategory.delete({ where: { id } }); 
  revalidatePath('/admin/inner-subcategories'); 
  revalidatePath('/', 'layout');
}

// Wholesaler Actions
export async function getWholesalers() { return await prisma.wholesaler.findMany({ orderBy: { createdAt: 'desc' } }); }

export async function createWholesaler(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.wholesaler.create({ 
    data: { 
      ...data, 
      password: hashedPassword,
      plainPassword: data.password // Store plain for admin
    } 
  });
  revalidatePath('/admin/wholesalers');
}

export async function updateWholesaler(id, data) {
  let updateData = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
    updateData.plainPassword = data.password; // Update plain for admin
  } else {
    delete updateData.password;
    delete updateData.plainPassword;
  }
  await prisma.wholesaler.update({ where: { id }, data: updateData });
  revalidatePath('/admin/wholesalers');
}

export async function deleteWholesaler(id) { await prisma.wholesaler.delete({ where: { id } }); revalidatePath('/admin/wholesalers'); }

// Order Actions
export async function getOrders() { 
  return await prisma.order.findMany({ 
    include: { wholesaler: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' } 
  }); 
}

export async function updateOrderStatus(id, status) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/admin/orders');
}

// Product Actions
export async function getProducts() { return await prisma.product.findMany({ include: { category: true, subCategory: true, innerSubCategory: true }, orderBy: { createdAt: 'asc' } }); }

export async function createProduct(data) { 
  try {
    const { 
      category, subCategory, innerSubCategory, 
      orderItems, savedBy,
      id, createdAt, updatedAt, 
      ...cleanData 
    } = data;

    // Extra safety: ensure no relation objects leak into scalar fields
    const { categoryId, subCategoryId, innerSubId, ...scalars } = cleanData;
    
    const prismaData = {
      ...scalars,
      mrp: roundToTwo(scalars.mrp),
      price: roundToTwo(scalars.price),
      offerPrice: roundToTwo(scalars.offerPrice),
      variants: Array.isArray(scalars.variants) 
        ? scalars.variants.map(v => ({ ...v, price: roundToTwo(v.price) }))
        : scalars.variants,
      category: { connect: { id: categoryId } },
      subCategory: { connect: { id: subCategoryId } }
    };
    
    if (innerSubId) {
      prismaData.innerSubCategory = { connect: { id: innerSubId } };
    }

    return await prisma.product.create({ data: prismaData }); 
  } catch (error) {
    if (error.code === 'P1001' || error.code === 'P1003') {
      throw new Error("Inventory database is currently warming up. Please try again in a few seconds.");
    }
    if (error.code === 'P2002') {
      throw new Error(`Duplicate Product ID: ${data.productId} already exists.`);
    }
    throw error;
  } finally {
    revalidatePath('/admin/products'); 
    revalidatePath('/', 'layout');
  }
}

export async function updateProduct(id, data) { 
  try {
    const { 
      category, subCategory, innerSubCategory, 
      orderItems, savedBy,
      id: _, createdAt, updatedAt, 
      ...cleanData 
    } = data;

    const oldItem = await prisma.product.findUnique({ where: { id } });
    if (oldItem?.images && data.images) {
      const removedImages = oldItem.images.filter(img => !data.images.includes(img));
      if (removedImages.length > 0) await deleteFromAllAccounts(removedImages, 'image');
    }
    if (oldItem?.videos && data.videos) {
      const removedVideos = oldItem.videos.filter(vid => !data.videos.includes(vid));
      if (removedVideos.length > 0) await deleteFromAllAccounts(removedVideos, 'video');
    }

    // Extra safety: ensure no relation objects leak into scalar fields
    delete cleanData.category;
    delete cleanData.subCategory;
    delete cleanData.innerSubCategory;
    delete cleanData.orderItems;
    delete cleanData.savedBy;
    const { categoryId, subCategoryId, innerSubId, ...scalars } = cleanData;
    
    const prismaData = {
      ...scalars,
      mrp: roundToTwo(scalars.mrp),
      price: roundToTwo(scalars.price),
      offerPrice: roundToTwo(scalars.offerPrice),
      variants: Array.isArray(scalars.variants) 
        ? scalars.variants.map(v => ({ ...v, price: roundToTwo(v.price) }))
        : scalars.variants,
      category: { connect: { id: categoryId } },
      subCategory: { connect: { id: subCategoryId } }
    };
    
    if (innerSubId) {
      prismaData.innerSubCategory = { connect: { id: innerSubId } };
    } else {
      prismaData.innerSubCategory = { disconnect: true };
    }

    return await prisma.product.update({ where: { id }, data: prismaData }); 
  } catch (error) {
    if (error.code === 'P1001' || error.code === 'P1003') {
      throw new Error("Inventory database is currently warming up. Please try again in a few seconds.");
    }
    if (error.code === 'P2002') {
      throw new Error(`Duplicate Product ID: ${data.productId} already exists.`);
    }
    throw error;
  } finally {
    revalidatePath('/admin/products'); 
    revalidatePath('/', 'layout');
  }
}

export async function deleteProduct(id) { 
  const item = await prisma.product.findUnique({ where: { id } });
  if (item?.images?.length > 0) await deleteFromAllAccounts(item.images, 'image');
  if (item?.videos?.length > 0) await deleteFromAllAccounts(item.videos, 'video');
  await prisma.product.delete({ where: { id } }); 
  revalidatePath('/admin/products'); 
  revalidatePath('/', 'layout');
}

// Review Actions
export async function getReviews() {
  return await prisma.review.findMany({
    include: { wholesaler: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateReviewStatus(id, status) {
  await prisma.review.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin/reviews');
}

export async function createReview(data) {
  // If wholesalerId is null/empty string, remove it from data to avoid prisma errors
  const { wholesalerId, ...rest } = data;
  const createData = {
    ...rest,
    status: 'APPROVED',
  };
  
  if (wholesalerId && wholesalerId !== "") {
    createData.wholesalerId = wholesalerId;
  }

  await prisma.review.create({
    data: createData
  });
  revalidatePath('/admin/reviews');
}

export async function deleteReview(id) {
  await prisma.review.delete({
    where: { id }
  });
  revalidatePath('/admin/reviews');
}

// Inquiry Actions
export async function getInquiries() {
  try {
    return await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("[getInquiries] Error - run `prisma generate && prisma db push`:", err?.message);
    return [];
  }
}

export async function deleteInquiry(id) {
  try {
    await prisma.inquiry.delete({
      where: { id }
    });
    revalidatePath('/admin/inquiries');
  } catch (err) {
    console.error("[deleteInquiry] Error:", err?.message);
    throw new Error("Could not delete inquiry. Please try again.");
  }
}

// Showcase Video Actions
export async function getShowcaseVideos() { 
  return await prisma.showcaseVideo.findMany({ 
    orderBy: { createdAt: 'desc' } 
  }); 
}

export async function createShowcaseVideo(data) { 
  await prisma.showcaseVideo.create({ data }); 
  revalidatePath('/admin/showcase-videos'); 
  revalidatePath('/');
  revalidatePath('/product/[id]', 'layout');
}

export async function deleteShowcaseVideo(id) { 
  const item = await prisma.showcaseVideo.findUnique({ where: { id } });
  if (item?.url?.startsWith('shree')) {
    await deleteFromAllAccounts(item.url, 'video');
  }
  await prisma.showcaseVideo.delete({ where: { id } }); 
  revalidatePath('/admin/showcase-videos'); 
  revalidatePath('/');
  revalidatePath('/product/[id]', 'layout');
}

// Review Video Actions
export async function getReviewVideos() { 
  return await prisma.reviewVideo.findMany({ 
    orderBy: { createdAt: 'desc' } 
  }); 
}

export async function createReviewVideo(data) { 
  await prisma.reviewVideo.create({ data }); 
  revalidatePath('/admin/review-videos'); 
  revalidatePath('/');
}

export async function deleteReviewVideo(id) { 
  const item = await prisma.reviewVideo.findUnique({ where: { id } });
  if (item?.url?.startsWith('shree')) {
    await deleteFromAllAccounts(item.url, 'video');
  }
  await prisma.reviewVideo.delete({ where: { id } }); 
  revalidatePath('/admin/review-videos'); 
  revalidatePath('/');
}

// AppConfig Actions (Cloudinary Management)
export async function getAppConfig() {
  let config = await prisma.appConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.appConfig.create({
      data: { id: 1, activeCloudinaryIndex: 0 }
    });
  }
  return config;
}

export async function updateAppConfig(data) {
  await prisma.appConfig.update({
    where: { id: 1 },
    data
  });
  revalidatePath('/admin/settings/storage');
}
