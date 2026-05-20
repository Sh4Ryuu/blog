import { motion } from 'framer-motion'

export default function CertBadges({ certs = [] }) {
  if (certs.length === 0) {
    return (
      <section id="certs" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl text-accent mb-8"
          >
            &gt; certifications
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 bg-surface border border-accent/30 rounded-lg"
            >
              <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <span className="font-mono text-accent text-2xl">BSCP</span>
              </div>
              <h3 className="font-heading text-xl text-text">Bugcrowd Security Certified Professional</h3>
              <p className="text-muted text-sm mt-1">Bugcrowd</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-surface border border-muted/30 rounded-lg opacity-60"
            >
              <div className="w-16 h-16 rounded-lg bg-muted/20 flex items-center justify-center mb-4">
                <span className="font-mono text-muted text-xl">?</span>
              </div>
              <h3 className="font-heading text-lg text-muted">More coming soon</h3>
              <p className="text-muted text-sm mt-1">OSCP, OSWE...</p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certs" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl text-accent mb-8"
        >
          &gt; certifications
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((cert, i) => (
            <motion.a
              key={cert.id}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="block p-6 bg-surface border border-accent/30 rounded-lg hover:border-accent/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <span className="font-mono text-accent text-2xl">{cert.id.toUpperCase()}</span>
              </div>
              <h3 className="font-heading text-xl text-text">{cert.name}</h3>
              <p className="text-muted text-sm mt-1">{cert.issuer}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
