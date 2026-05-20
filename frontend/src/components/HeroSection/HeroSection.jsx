import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const typewriterPhrases = [
  'Penetration Tester | Bug Hunter',
  'Breaking things legally since day one',
  'Aspiring Red Team Professional',
]

function Typewriter({ phrases, speed = 80, pause = 2000 }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[phraseIndex]
    const timeout = isDeleting ? speed / 2 : speed

    const timer = setTimeout(() => {
      if (isDeleting) {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1)
        } else {
          setIsDeleting(false)
          setPhraseIndex((p) => (p + 1) % phrases.length)
        }
      } else {
        if (charIndex < phrase.length) {
          setCharIndex((c) => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), pause)
        }
      }
    }, timeout)

    return () => clearTimeout(timer)
  }, [charIndex, phraseIndex, isDeleting, phrases, speed, pause])

  return (
    <span className="text-muted font-mono text-lg md:text-xl">
      {phrases[phraseIndex].slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function HeroSection() {
  const [scrollOpacity, setScrollOpacity] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.min(window.scrollY / 600, 0.5)
      setScrollOpacity(opacity)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-screen min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background image with scroll fade-to-black overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: scrollOpacity }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #0d0d0d 100%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Glitch text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl mb-6"
        >
          <span
            className="glitch text-accent"
            data-text="Sh4Ryuu"
          >
            Sh4Ryuu
          </span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="min-h-[2rem] mb-10"
        >
          <Typewriter phrases={typewriterPhrases} />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/blog"
            className="px-6 py-3 font-mono text-sm font-semibold rounded border transition-colors hover:bg-accent/10"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            read the blog →
          </Link>
          <Link
            to="/about#about"
            className="px-6 py-3 font-mono text-sm font-semibold rounded border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--color-muted)', color: 'var(--color-muted)' }}
          >
            about me
          </Link>
        </motion.div>

        {/* Terminal hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 font-mono text-muted text-sm"
        >
          <span className="text-accent">$</span> Press{' '}
          <kbd className="px-1.5 py-0.5 bg-surface rounded border border-muted/30">
            `
          </kbd>{' '}
          to open terminal
        </motion.p>
      </div>
    </section>
  )
}
