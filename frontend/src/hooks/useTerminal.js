import { useState, useEffect } from 'react'

export function useTerminal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
        if (!isInput) {
          e.preventDefault()
          setIsOpen((o) => !o)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setOpen: setIsOpen, toggle: () => setIsOpen((o) => !o) }
}
