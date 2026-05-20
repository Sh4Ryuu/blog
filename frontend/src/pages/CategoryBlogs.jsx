import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchBlogsByCategory } from '../lib/api'

export default function CategoryBlogs() {
  const { category } = useParams()
  const decoded = decodeURIComponent(category)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogsByCategory(decoded)
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [decoded])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: 'var(--color-accent)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 font-mono text-sm hover:opacity-80 transition-colors"
            style={{ color: 'var(--color-accent)' }}
          >
            ← Back to Categories
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-heading text-4xl" style={{ color: 'var(--color-accent)' }}>
            {decoded}
          </h1>
          <span className="inline-block mt-4 px-4 py-2 rounded-full font-mono text-sm"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-muted)', opacity: 0.3 }}>
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </span>
        </motion.div>

        {blogs.length > 0 ? (
          <div className="space-y-6">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-muted)', opacity: 0.3 }}
              >
                <Link to={`/blog/${blog.slug}`} className="block">
                  <h2 className="font-heading text-2xl mb-2 hover:opacity-80 transition-colors"
                    style={{ color: 'var(--color-accent)' }}>
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="mb-4" style={{ opacity: 0.8 }}>{blog.excerpt}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm font-mono" style={{ opacity: 0.7 }}>
                    {blog.date && <span>📅 {blog.date}</span>}
                    {blog.difficulty && <span>⚡ {blog.difficulty}</span>}
                    {blog.os && <span>💻 {blog.os}</span>}
                  </div>
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded text-xs font-mono"
                          style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-muted)', opacity: 0.5 }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-right mt-4">
                    <span className="font-mono text-sm" style={{ color: 'var(--color-accent)' }}>
                      Read more →
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <h3 className="font-heading text-xl mb-2" style={{ color: 'var(--color-accent)' }}>No posts yet</h3>
            <p style={{ opacity: 0.7 }}>Check back soon or explore other categories.</p>
            <Link to="/categories"
              className="inline-block mt-6 px-6 py-3 rounded font-mono text-sm hover:opacity-80"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
              Explore Other Categories
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
