// Custom terminal commands: whoami, ls, help, cat, clear, socials, contact

// Map cert filenames to their blog slugs
export const certs = {
  'bscp.cert': { title: 'BSCP — Burp Suite Certified Practitioner', slug: 'bscp-journey' },
}

export const commands = {
  whoami: () =>
    'Sh4Ryuu — Penetration Tester & Aspiring Red Teamer | BSCP Certified\nSkills: Web Pentesting · Active Directory · LLM Pentesting · Bug Bounty · OSINT · Red Teaming',

  ls: (args, blogs = []) => {
    if (args[0] === 'certs/' || args[0] === 'certs') {
      return 'bscp.cert  (more coming...)'
    }
    if (args[0] === 'blogs/' || args[0] === 'blogs') {
      if (!blogs.length) return '(no blogs found)'
      return blogs.map((b, i) => `[${i + 1}] ${b.slug} — ${b.title}`).join('\n')
    }
    return 'certs/  blogs/\n\nTry: ls certs/  or  ls blogs/'
  },

  help: () =>
    'Available commands: whoami, ls, cat, clear, socials, contact\n\n' +
    '  ls              — list directories\n' +
    '  ls blogs/       — list all blog posts\n' +
    '  ls certs/       — list certifications\n' +
    '  cat <slug>      — open a blog post\n' +
    '  whoami          — about me\n' +
    '  socials         — social links\n' +
    '  contact         — get in touch\n' +
    '  clear           — clear terminal',

  cat: (args, blogs = []) => {
    if (!args[0]) return 'Usage: cat <slug>\nExample: cat HTB-Pirate\n\nRun "ls blogs/" to see available posts.'
    if (args[0] === 'blogs/' || args[0] === 'blogs') {
      if (!blogs.length) return '(no blogs found)'
      return blogs.map((b, i) => `[${i + 1}] ${b.slug}`).join('\n') + '\n\nUse: cat <slug> to open'
    }
    if (args[0] === 'certs/' || args[0] === 'certs') {
      return 'bscp.cert  (more coming...)'
    }
    if (certs[args[0]]) return `__navigate__/blog/${certs[args[0]].slug}`
    const blog = blogs.find((b) => b.slug === args[0])
    if (blog) return `Opening: ${blog.title}\n→ /blog/${blog.slug}`
    return `File not found: ${args[0]}\n\nRun "ls blogs/" to see available posts.`
  },

  clear: () => '__clear__',
  socials: () => 'GitHub | Twitter | LinkedIn — links in footer!',
  contact: () => 'Scroll down to Contact section or click Contact in nav.',
}
