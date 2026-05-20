import { motion } from 'framer-motion'

const skills = [
  'Web Pentesting',
  'Active Directory',
  'Bug Bounty',
  'OSINT',
  'Red Teaming'
]

export default function About() {
  return (
    <div id="about" className="min-h-screen pt-24 px-6" style={{backgroundColor: 'var(--color-background)', color: 'var(--color-text)'}}>
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl mb-8"
          style={{color: 'var(--color-accent)'}}
        >
          &gt; about
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-12"
          style={{color: 'var(--color-text)', opacity: 0.9}}
        >
          <p className="text-lg leading-relaxed">
            I am a penetration tester and aspiring red team professional, with a passion for
            identifying security vulnerabilities and helping organizations strengthen their
            defensive posture. My journey in cybersecurity has been driven by curiosity,
            hands-on practice on HackTheBox and a commitment to staying ahead of emerging
            threats and attack techniques.
          </p>
          <p className="text-lg leading-relaxed">
            With expertise in web application security, Active Directory environments, and
            bug bounty hunting, I bring a practical and comprehensive approach to security
            assessments. I specialize in identifying complex attack chains and providing
            actionable remediation strategies to improve overall security maturity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-2xl mb-6" style={{color: 'var(--color-accent)'}}>&gt; skills</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            {skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-4 py-2 font-mono text-sm rounded transition-colors cursor-default hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid var(--color-muted)`,
                  opacity: 0.3
                }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
