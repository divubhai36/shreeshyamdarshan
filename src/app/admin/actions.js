"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

// Product Actions
export async function getProducts() { return await prisma.product.findMany({ include: { category: true, subCategory: true, innerSubCategory: true }, orderBy: { createdAt: 'desc' } }); }
export async function createProduct(data) { await prisma.product.create({ data }); revalidatePath('/admin/products'); }
export async function updateProduct(id, data) { await prisma.product.update({ where: { id }, data }); revalidatePath('/admin/products'); }
export async function deleteProduct(id) { await prisma.product.delete({ where: { id } }); revalidatePath('/admin/products'); }
