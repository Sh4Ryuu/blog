import { useEffect } from 'react'

export default function AvatarAssistant() {
  useEffect(() => {
    if (document.querySelector('#live2d-widget-script')) return

    // DevTools detection
    let devtools = { open: false }
    const threshold = 160
    const devToolsMsg = "Oh? Opening DevTools? Found anything interesting in here?"

    const showMsg = (msg, attempts = 0) => {
      if (window.live2d?.showMessage) {
        window.live2d.showMessage(msg)
      } else if (attempts < 20) {
        setTimeout(() => showMsg(msg, attempts + 1), 500)
      }
    }

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      const isOpen = widthDiff > threshold || heightDiff > threshold

      if (isOpen && !devtools.open) {
        devtools.open = true
        showMsg(devToolsMsg)
      } else if (!isOpen && devtools.open) {
        devtools.open = false
      }
    }

    setTimeout(checkDevTools, 500)
    const devtoolsInterval = setInterval(checkDevTools, 1000)

    const handleKeyDown = (e) => {
      const key = e.key?.toLowerCase()
      const isDevToolsShortcut =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (key === 'c' || key === 'i' || key === 'j'))
      if (isDevToolsShortcut) {
        setTimeout(checkDevTools, 600)
      }
    }

    const handleContextMenu = () => {
      setTimeout(checkDevTools, 800)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    window.live2d_settings = {
      waifuEdge: 'left',
      showToolMenu: true,
      waifuTipsDuration: 4000,
      waifuModel: 5,

      waifuTipsPath: '/waifu-tips.json',

      waifuIdleMessage: [
        'Stop poking me, it tickles! 🫵😤',
        "I need 0xCAFEBABE or I'll segfault... ☕💀",
        'Where is the flag?! 🚩🔍',
      ],

      waifuTips: {
        click: [
          {
            selector: '#live2d',
            text: [
              'Stop poking me, it tickles! 🫵😤',
              "I need 0xCAFEBABE or I'll segfault... ☕💀",
              'Where is the flag?! 🚩🔍',
            ],
          },
        ],
        mouseover: [
          {
            selector: 'a',
            text: [
              'A link? Could be phishing...',
              'Hover carefully.',
            ],
          },
          {
            selector: 'button',
            text: [
              'About to trigger something?',
              'Buttons are just unvalidated inputs.',
            ],
          },
        ],
      },
    }

    // Intercept the remote waifu-tips fetch and replace with our own
    if (!window.__waifuTipsPatchedFetch && typeof window.fetch === 'function') {
      const originalFetch = window.fetch
      window.fetch = function (url, ...args) {
        if (typeof url === 'string' && url.includes('waifu-tips')) {
          return originalFetch('/waifu-tips.json', ...args)
        }
        return originalFetch(url, ...args)
      }
      window.__waifuTipsPatchedFetch = true
    }

    // Intercept XMLHttpRequest for older browsers
    if (!window.__waifuTipsPatchedXHR && typeof XMLHttpRequest !== 'undefined') {
      const originalOpen = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function (method, url, ...args) {
        if (typeof url === 'string' && url.includes('waifu-tips')) {
          url = '/waifu-tips.json'
        }
        return originalOpen.call(this, method, url, ...args)
      }
      window.__waifuTipsPatchedXHR = true
    }

    const handleMouseMove = (e) => {
      if (window.live2d && typeof window.live2d.focus === 'function') {
        // live2d.focus() expects FocusOptions, not coordinates
        // Use a different method or check what parameters are available
        if (typeof window.live2d.lookAt === 'function') {
          window.live2d.lookAt({ x: e.clientX, y: e.clientY })
        }
      }
    }

    const script = document.createElement('script')
    script.id = 'live2d-widget-script'
    script.src = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js'
    script.async = true
    script.onload = () => {
      window.addEventListener('mousemove', handleMouseMove)
    }
    document.body.appendChild(script)

    return () => {
      clearInterval(devtoolsInterval)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return null
}