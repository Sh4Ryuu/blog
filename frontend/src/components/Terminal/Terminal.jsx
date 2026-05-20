import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { commands, certs } from './commands'
import { fetchBlogs } from '../../lib/api'
import './terminal.css'

function parseInput(input) {
  const parts = input.trim().split(/\s+/)
  return [parts[0]?.toLowerCase() || '', parts.slice(1)]
}

export default function Terminal({ isOpen, onClose, onNavigate }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Sh4Ryuu terminal. Type `help` to get started.' },
  ])
  const [input, setInput] = useState('')
  const [blogs, setBlogs] = useState([])
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    fetchBlogs().then(setBlogs).catch(() => {})
  }, [])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const execute = (cmd, args) => {
    // cat <slug> → navigate if real blog slug
    if (cmd === 'cat' && args[0] && args[0] !== 'blogs/' && args[0] !== 'blogs' && args[0] !== 'certs/' && args[0] !== 'certs') {
      const blog = blogs.find((b) => b.slug === args[0])
      if (blog && onNavigate) {
        setHistory((h) => [...h, { type: 'output', text: `Opening: ${blog.title}\n→ /blog/${blog.slug}` }])
        onNavigate(`/blog/${blog.slug}`)
        return
      }
    }

    const fn = commands[cmd]
    if (!fn) {
      setHistory((h) => [
        ...h,
        { type: 'output', text: `Command not found: ${cmd}. Type 'help' for available commands.` },
      ])
      return
    }

    const result = typeof fn === 'function' ? fn(args, blogs) : fn

    if (result === '__clear__') {
      setHistory([])
      return
    }

    if (typeof result === 'string' && result.startsWith('__navigate__')) {
      const path = result.replace('__navigate__', '')
      const cert = certs[args[0]]
      const label = cert ? `Opening: ${cert.title}\n→ ${path}` : `Opening: ${path}`
      setHistory((h) => [...h, { type: 'output', text: label }])
      if (onNavigate) onNavigate(path)
      return
    }

    setHistory((h) => [...h, { type: 'output', text: result }])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const [cmd, args] = parseInput(input)
    setHistory((h) => [...h, { type: 'input', text: `$ ${input}` }])
    setInput('')
    execute(cmd, args)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="terminal-container"
      >
        <div className="terminal-header">
          <span className="terminal-title">sh4ryuu@portfolio:~</span>
          <button onClick={onClose} className="terminal-close" aria-label="Close terminal">
            ×
          </button>
        </div>
        <div className="terminal-body">
          {history.map((item, i) => (
            <div key={i} className={item.type === 'input' ? 'terminal-input-line' : 'terminal-output'}>
              {item.type === 'input' ? <span className="text-accent">$</span> : null}
              <pre className={item.type === 'output' ? 'terminal-pre' : ''}>
                {item.text.split('\n').map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 ? '\n' : ''}</span>
                ))}
              </pre>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-form">
            <span className="text-accent">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              placeholder=" "
              autoComplete="off"
              spellCheck={false}
            />
          </form>
          <div ref={endRef} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
