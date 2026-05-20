import { motion } from 'framer-motion'

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl text-accent mb-8"
        >
          &gt; contact
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-text/90">
            Interested in security research, bug bounty, or collaboration?
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:hello@sh4ryuu.me"
              className="px-6 py-3 bg-accent text-background font-mono font-semibold rounded border border-accent hover:bg-accent/90 transition-colors"
            >
              Email
            </a>
            <a
              href="https://github.com/sh4ryuu"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-accent text-accent font-mono font-semibold rounded hover:bg-accent/10 transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
