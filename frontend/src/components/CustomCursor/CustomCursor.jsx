import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const rafId = useRef(null)
  const isHovering = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      const target = e.target
      const interactive =
        target &&
        (target.closest &&
          target.closest('a,button,[data-cursor-hover]'))

      isHovering.current = !!interactive
    }

    const render = () => {
      const { x, y } = mousePos.current

      const dot = dotRef.current
      const ring = ringRef.current

      if (dot) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }

      if (ring) {
        ringPos.current.x += (x - ringPos.current.x) * 0.15
        ringPos.current.y += (y - ringPos.current.y) * 0.15

        const scale = isHovering.current ? 2 : 1

        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale})`
        ring.style.backgroundColor = isHovering.current
          ? 'rgba(0, 255, 156, 0.2)'
          : 'transparent'
        ring.style.borderColor = '#00ff9c'
      }

      rafId.current = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent mix-blend-screen"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-transparent transition-[transform,background-color] duration-150 ease-out"
      />
    </>
  )
}

