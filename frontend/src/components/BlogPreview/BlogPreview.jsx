import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchBlogs } from '../../lib/api'
import BlogCard from '../BlogCard/BlogCard'

export default function BlogPreview() {
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
    <section id="blog" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="font-heading text-3xl text-accent">&gt; recent posts</h2>
          <Link
            to="/blog"
            className="font-mono text-sm text-accent hover:underline"
          >
            View all →
          </Link>
        </motion.div>

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
            {blogs.slice(0, 4).map((blog, i) => (
              <BlogCard key={blog.slug} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
