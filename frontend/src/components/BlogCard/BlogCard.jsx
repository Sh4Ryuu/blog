import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/blog/${blog.slug}`}
        className="block p-6 bg-surface border border-muted/30 rounded-lg hover:border-accent/50 transition-colors group"
      >
        <h3 className="font-heading text-xl text-accent group-hover:text-accent/90">
          {blog.title}
        </h3>
        <p className="text-muted text-sm mt-1 font-mono">{blog.date}</p>
        <p className="text-text/80 mt-3 line-clamp-2">{blog.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {blog.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-mono bg-accent-alt/20 text-accent-alt rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  )
}
