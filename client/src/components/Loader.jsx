import { motion } from 'framer-motion'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="w-full flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ boxShadow: '0 0 20px rgba(59,130,246,0.6)' }}
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}
