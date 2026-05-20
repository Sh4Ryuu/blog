import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t" style={{borderColor: 'var(--color-surface)'}}>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm" style={{color: 'var(--color-muted)'}}>
          Sh4Ryuu — built with ❤️
        </p>
        <div className="flex gap-6">
          <Link to="/blog" className="font-mono text-sm hover:opacity-80 transition-colors" style={{color: 'var(--color-muted)'}}>
            Blog
          </Link>
          <Link to="/categories" className="font-mono text-sm hover:opacity-80 transition-colors" style={{color: 'var(--color-muted)'}}>
            Categories
          </Link>
        </div>
      </div>
    </footer>
  )
}
