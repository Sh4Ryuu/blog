import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about#about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/categories', label: 'Categories' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar({ onTerminalToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{backgroundColor: 'var(--color-background)', opacity: 0.8, borderColor: 'var(--color-surface)'}}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading font-bold text-xl hover:opacity-80 transition-colors"
          style={{color: 'var(--color-accent)'}}
        >
          Sh4Ryuu
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <button
              onClick={(e) => toggleTheme(e)}
              className="font-mono text-sm transition-colors hover:opacity-80"
              style={{color: 'var(--color-muted)'}}
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="font-mono text-sm transition-colors hover:opacity-80"
                style={{color: 'var(--color-muted)'}}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 font-mono"
          style={{color: 'var(--color-accent)'}}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '[X]' : '[≡]'}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)'}}
          >
            <ul className="px-6 py-4 space-y-4">
              <li>
                <button
                  onClick={(e) => { toggleTheme(e); setMobileOpen(false); }}
                  className="block font-mono text-sm transition-colors w-full text-left hover:opacity-80"
                  style={{color: 'var(--color-muted)'}}
                >
                  {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              </li>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block font-mono text-sm transition-colors hover:opacity-80"
                    style={{color: 'var(--color-muted)'}}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
