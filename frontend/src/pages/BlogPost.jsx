import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import hljs from 'highlight.js'
import { fetchBlog, fetchBlogs } from '../lib/api'
import BlogPassword from '../components/BlogPassword/BlogPassword'
import 'highlight.js/styles/github-dark.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      fetchBlog(slug),
      fetchBlogs(),
    ])
      .then(([blogPost, blogs]) => {
        setPost(blogPost)
        setAllBlogs([...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!post) return

    // rAF ensures React has committed the dangerouslySetInnerHTML to the DOM
    const raf = requestAnimationFrame(() => {
      const container = contentRef.current
      if (!container) return

      // Syntax highlighting
      container.querySelectorAll('pre code').forEach((el) => {
        const langClass = [...el.classList].find((c) => c.startsWith('language-'))
        const lang = langClass?.replace('language-', '')
        if (lang && hljs.getLanguage(lang)) {
          el.innerHTML = hljs.highlight(el.textContent, { language: lang }).value
          el.classList.add('hljs')
        } else {
          hljs.highlightElement(el)
        }
      })

      // Copy buttons
      container.querySelectorAll('pre').forEach((pre) => {
        if (pre.parentElement?.classList.contains('code-wrapper')) return

        const wrapper = document.createElement('div')
        wrapper.className = 'code-wrapper'
        pre.parentNode.insertBefore(wrapper, pre)
        wrapper.appendChild(pre)

        const btn = document.createElement('button')
        btn.className = 'copy-btn'
        btn.textContent = 'copy'

        btn.addEventListener('click', (e) => {
          const code = pre.querySelector('code')?.innerText ?? pre.innerText
          navigator.clipboard.writeText(code + '\n\n# Source: Sh4Ryuu — sh4ryuu.com')

          const ripple = document.createElement('span')
          ripple.className = 'copy-ripple'
          ripple.style.left = e.clientX + 'px'
          ripple.style.top = e.clientY + 'px'
          document.body.appendChild(ripple)
          setTimeout(() => ripple.remove(), 700)

          btn.textContent = 'copied!'
          btn.classList.add('copied')
          setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied') }, 2000)
        })

        wrapper.appendChild(btn)
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [post])

  if (loading) return (
    <div className="min-h-screen pt-24 px-6">
      <p className="font-mono text-muted">Loading...</p>
    </div>
  )

  if (error || !post) return (
    <div className="min-h-screen pt-24 px-6">
      <p className="font-mono text-danger">Post not found</p>
      <Link to="/blog" className="text-accent hover:underline mt-4 inline-block">← Back to blog</Link>
    </div>
  )

  // Show password modal if post is protected and not authenticated
  if (post?.is_protected && !isAuthenticated) {
    return (
      <BlogPassword 
        blogTitle={post.title}
        onAuthenticated={setIsAuthenticated}
      />
    )
  }

  const html = post.content_html || post.content || ''
  const wordCount = post.content?.trim().split(/\s+/).length || 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  const currentIndex = allBlogs.findIndex((b) => b.slug === slug)
  const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const nextPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  return (
    <article className="min-h-screen pt-24 px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="font-mono text-sm text-accent hover:underline mb-6 inline-block">
          ← Back to blog
        </Link>
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-3xl md:text-4xl text-accent">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted font-mono text-sm">{post.date}</p>
            <p className="text-muted font-mono text-sm">~ {readingTime} min read</p>
          </div>
          {(post.difficulty || post.os) && (
            <p className="text-muted font-mono text-xs mt-1">
              {[post.difficulty, post.os].filter(Boolean).join(' · ')}
            </p>
          )}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-mono bg-accent-alt/20 text-accent-alt rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          ref={contentRef}
          className="blog-post-content mt-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Next / Previous navigation */}
        {(prevPost || nextPost) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t grid grid-cols-2 gap-4"
            style={{ borderColor: 'var(--color-muted)' }}
          >
            <div>
              {prevPost && (
                <Link to={`/blog/${prevPost.slug}`} className="group block">
                  <p className="font-mono text-xs mb-1" style={{ color: 'var(--color-muted)' }}>← newer</p>
                  <p className="font-heading text-sm group-hover:opacity-80 transition-opacity" style={{ color: 'var(--color-accent)' }}>
                    {prevPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="group block">
                  <p className="font-mono text-xs mb-1" style={{ color: 'var(--color-muted)' }}>older →</p>
                  <p className="font-heading text-sm group-hover:opacity-80 transition-opacity" style={{ color: 'var(--color-accent)' }}>
                    {nextPost.title}
                  </p>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </article>
  )
}
