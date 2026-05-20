const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchBlogs() {
  const res = await fetch(`${API_BASE}/api/blogs`)
  if (!res.ok) throw new Error('Failed to fetch blogs')
  return res.json()
}

export async function fetchBlog(slug) {
  const res = await fetch(`${API_BASE}/api/blogs/${slug}`)
  if (!res.ok) throw new Error('Failed to fetch blog')
  return res.json()
}

export async function fetchBlogsByCategory(category) {
  const res = await fetch(`${API_BASE}/api/blogs/category/${category}`)
  if (!res.ok) throw new Error('Failed to fetch blogs by category')
  return res.json()
}

export async function checkBlogPassword(slug, password) {
  const res = await fetch(`${API_BASE}/api/blogs/check-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug, password }),
  })
  if (!res.ok) throw new Error('Failed to check password')
  return res.json()
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('API unhealthy')
  return res.json()
}
