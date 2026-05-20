import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BlogPassword({ onAuthenticated, blogTitle }) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Get blog slug from URL or pass it as prop
      const slug = window.location.pathname.split('/').pop()
      const response = await fetch(`/api/blogs/check-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, password }),
      })

      const result = await response.json()

      if (result.success) {
        onAuthenticated(true)
      } else {
        setError(result.error || 'Incorrect password')
      }
    } catch (err) {
      setError('Failed to verify password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) return
        onAuthenticated(false) // Close modal when clicking outside
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border border-surface rounded-lg p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h2 className="font-heading text-xl mb-2" style={{color: 'var(--color-accent)'}}>
            🔐 Password Required
          </h2>
          <p className="text-sm mb-4" style={{opacity: 0.8}}>
            This blog post is protected. Please enter the password to view the content.
          </p>
          <p className="text-xs font-mono" style={{opacity: 0.6}}>
            Blog: {blogTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-mono mb-2" style={{color: 'var(--color-text)'}}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-surface rounded font-mono text-sm focus:outline-none focus:border-accent"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-surface)'
              }}
              placeholder="Enter password..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-mono mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-accent text-background font-mono text-sm rounded hover:opacity-80 transition-colors disabled:opacity-50"
            style={{color: 'var(--color-background)'}}
          >
            {isLoading ? 'Verifying...' : 'Access Content'}
          </button>
        </form>

        <button
          onClick={() => onAuthenticated(false)}
          className="absolute top-4 right-4 text-sm font-mono hover:opacity-80 transition-colors"
          style={{color: 'var(--color-muted)'}}
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}
