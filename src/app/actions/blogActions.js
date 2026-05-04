"use client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// These are client-side stubs that will call the real server actions
// In Next.js App Router, it's better to keep actions separate

export async function getBlogs() {
  const res = await fetch('/api/blogs');
  return res.json();
}

export async function createBlog(data) {
  const res = await fetch('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateBlog(id, data) {
  const res = await fetch(`/api/blogs?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteBlog(id) {
  const res = await fetch(`/api/blogs?id=${id}`, {
    method: 'DELETE'
  });
  return res.json();
}
