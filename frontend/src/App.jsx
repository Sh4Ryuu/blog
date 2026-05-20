import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Terminal from './components/Terminal/Terminal'
import AvatarAssistant from './components/AvatarAssistant/AvatarAssistant'
import CustomCursor from './components/CustomCursor/CustomCursor'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import { useTerminal } from './hooks/useTerminal'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Categories from './pages/Categories'
import CategoryBlogs from './pages/CategoryBlogs'
import NotFound from './pages/NotFound'

const awayTitles = ['traitor !']

function App() {
  const { isOpen, setOpen, toggle } = useTerminal()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const originalTitle = document.title || 'Sh4Ryuu'
    let idx = 0

    const faviconEl = document.querySelector("link[rel~='icon']")
    const originalHref = faviconEl?.href || '/favicon.svg'
    const awayFavicon = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💀</text></svg>`

    const handleVisibility = () => {
      if (document.hidden) {
        document.title = awayTitles[idx % awayTitles.length]
        idx++
        if (faviconEl) faviconEl.href = awayFavicon
      } else {
        document.title = originalTitle
        if (faviconEl) faviconEl.href = originalHref
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [location.pathname])

  return (
    <div className="min-h-screen font-body" style={{backgroundColor: 'var(--color-background)', color: 'var(--color-text)'}}>
      <CustomCursor />
      <Navbar onTerminalToggle={toggle} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<CategoryBlogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Terminal isOpen={isOpen} onClose={() => setOpen(false)} onNavigate={navigate} />
      <AvatarAssistant />
      <ScrollToTop />
    </div>
  )
}

export default App
