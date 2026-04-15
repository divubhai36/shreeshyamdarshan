"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { roundToTwo } from "@/lib/utils";

// Category Actions
export async function getCategories() { return await prisma.category.findMany({ orderBy: { createdAt: 'desc' } }); }
export async function createCategory(data) { await prisma.category.create({ data }); revalidatePath('/admin/categories'); }
export async function updateCategory(id, data) { await prisma.category.update({ where: { id }, data }); revalidatePath('/admin/categories'); }
export async function deleteCategory(id) { await prisma.category.delete({ where: { id } }); revalidatePath('/admin/categories'); }

// Subcategory Actions
export async function getSubCategories() { return await prisma.subCategory.findMany({ include: { category: true }, orderBy: { name: 'asc' } }); }
export async function createSubCategory(data) { await prisma.subCategory.create({ data }); revalidatePath('/admin/subcategories'); }
export async function updateSubCategory(id, data) { await prisma.subCategory.update({ where: { id }, data }); revalidatePath('/admin/subcategories'); }
export async function deleteSubCategory(id) { await prisma.subCategory.delete({ where: { id } }); revalidatePath('/admin/subcategories'); }

// InnerSubcategory Actions
export async function getInnerSubCategories() { return await prisma.innerSubCategory.findMany({ include: { subCategory: { include: { category: true } } }, orderBy: { name: 'asc' } }); }
export async function createInnerSubCategory(data) { await prisma.innerSubCategory.create({ data }); revalidatePath('/admin/inner-subcategories'); }
export async function updateInnerSubCategory(id, data) { await prisma.innerSubCategory.update({ where: { id }, data }); revalidatePath('/admin/inner-subcategories'); }
export async function deleteInnerSubCategory(id) { await prisma.innerSubCategory.delete({ where: { id } }); revalidatePath('/admin/inner-subcategories'); }

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
export async function getProducts() { return await prisma.product.findMany({ include: { category: true, subCategory: true, innerSubCategory: true }, orderBy: { createdAt: 'desc' } }); }

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
  }
}

export async function deleteProduct(id) { await prisma.product.delete({ where: { id } }); revalidatePath('/admin/products'); }

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
  return await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteInquiry(id) {
  await prisma.inquiry.delete({
    where: { id }
  });
  revalidatePath('/admin/inquiries');
}
