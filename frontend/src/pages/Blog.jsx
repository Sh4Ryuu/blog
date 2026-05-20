import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchBlogs } from '../lib/api'
import BlogCard from '../components/BlogCard/BlogCard'

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogs()
      .then((data) => setBlogs([...data].sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl text-accent mb-2"
        >
          &gt; blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted font-mono mb-12"
        >
          Writeups, tips, and security research
        </motion.p>

        {loading && (
          <p className="font-mono text-muted">Loading...</p>
        )}
        {error && (
          <p className="font-mono text-danger">Failed to load: {error}</p>
        )}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-muted">No posts yet.</p>
        )}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.slug} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
