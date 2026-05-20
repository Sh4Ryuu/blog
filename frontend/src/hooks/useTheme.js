import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2

    // Compute radius large enough to cover any corner of the screen
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const ripple = document.createElement('div')
    const diameter = radius * 2

    Object.assign(ripple.style, {
      position: 'fixed',
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      width: `${diameter}px`,
      height: `${diameter}px`,
      borderRadius: '50%',
      background: nextTheme === 'dark' ? '#0d0d0d' : '#ffffff',
      transform: 'scale(0)',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: '9999',
      pointerEvents: 'none',
    })

    document.body.appendChild(ripple)

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)'
    })

    // Switch theme halfway through so the ripple covers the change
    setTimeout(() => setTheme(nextTheme), 250)

    // Remove ripple after animation completes
    setTimeout(() => ripple.remove(), 550)
  }

  return { theme, toggleTheme }
}
