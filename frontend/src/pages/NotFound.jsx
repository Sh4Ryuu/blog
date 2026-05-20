// 404 hacker-style page
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <span className="font-mono text-accent text-6xl">404</span>
      <h1 className="font-heading text-2xl text-text mt-4">Page not found</h1>
      <p className="text-muted mt-2">$ cd .. && ls</p>
      <a href="/" className="mt-6 text-accent hover:underline font-mono">
        ← Back to home
      </a>
    </div>
  )
}
