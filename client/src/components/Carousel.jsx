import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Carousel({ images = [], aspect = 'aspect-[16/9]' }) {
  const [index, setIndex] = useState(0)
  const safeImages = images.length ? images : [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop',
    'https://th.bing.com/th/id/OIP.YlB1Z22pHKdxHJyvH78h8gHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',    
    'https://tse1.mm.bing.net/th/id/OIP.FtudhIBH-HYhxMpS4TU-sAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3'
  ]

  const go = (dir) => {
    setIndex((prev) => (prev + dir + safeImages.length) % safeImages.length)
  }

  return (
    <div className="w-full">
      <div className={`relative overflow-hidden rounded-xl ${aspect}`}>
        <AnimatePresence initial={false}>
          <motion.img
            key={safeImages[index]}
            src={safeImages[index]}
            className="w-50% h-50% object-cover"  //later change this image display size 
            
            initial={{ opacity: 0, scale: 1.02 }}

            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            alt="Hotel"
          />
        </AnimatePresence>

        <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 glass-effect rounded-full w-9 h-9">‹</button>
        <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 glass-effect rounded-full w-9 h-9">›</button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {safeImages.map((src, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-14 w-24 rounded-md overflow-hidden border ${i===index?'border-primary':'border-transparent'} `}>
            <img src={src} className="w-full h-full object-cover" alt="thumb" />
          </button>
        ))}
      </div>
    </div>
  )
  
}
