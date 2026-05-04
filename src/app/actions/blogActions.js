"use client";

// These are client-side wrappers that call our API routes
// We don't need prisma or revalidatePath here because the logic is in the API route

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
