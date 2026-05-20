import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchBlogs } from '../lib/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
      .then((blogs) => {
        // Group blogs by category, only include categories with at least 1 blog
        const map = {}
        blogs.forEach((blog) => {
          if (!blog.category) return
          if (!map[blog.category]) map[blog.category] = []
          map[blog.category].push(blog)
        })
        setCategories(Object.entries(map).map(([name, posts]) => ({ name, posts })))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          &gt; categories
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg mb-12"
          style={{ opacity: 0.8 }}
        >
          Explore content organized by category
        </motion.p>

        <div className="grid gap-8 md:grid-cols-2">
          {categories.map(({ name, posts }, index) => (
            <Link key={name} to={`/categories/${encodeURIComponent(name)}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-lg border transition-all cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-muted)',
                  opacity: 0.3,
                }}
              >
                <div className="mb-4">
                  <h3 className="font-heading text-xl" style={{ color: 'var(--color-accent)' }}>
                    {name}
                  </h3>
                  <p className="text-sm" style={{ opacity: 0.7 }}>
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-mono" style={{ opacity: 0.7 }}>Recent posts:</p>
                  {posts.slice(0, 3).map((blog) => (
                    <div key={blog.slug} className="text-sm font-mono" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>
                      → {blog.title}
                    </div>
                  ))}
                  {posts.length > 3 && (
                    <p className="text-xs font-mono" style={{ opacity: 0.6 }}>
                      ... and {posts.length - 3} more
                    </p>
                  )}
                </div>

                <div className="mt-4 text-sm font-mono" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>
                  View all {name} posts →
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
