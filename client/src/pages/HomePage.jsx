import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { hotelsAPI } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function HomePage() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const { data: hotels } = useQuery({
    queryKey: ['featured-hotels'],
    queryFn: async () => (await hotelsAPI.getAll()).data.slice(0, 6)
  })

  const onSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-purple-500/20 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <motion.h1
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-center text-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discover Futuristic Stays
          </motion.h1>
          <motion.p
            className="mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Book premium hotels with a sleek, modern experience. Neon vibes, glass surfaces, and silky animations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="mt-10 mx-auto max-w-3xl glass-effect rounded-xl p-4 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <Input type="date" />
              <Input type="date" />
              <Button variant="gradient" onClick={onSearch}>Search</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Hotels</h2>
          <Button variant="ghost" onClick={() => navigate('/hotels')}>View all</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels?.map((h) => (
            <Card key={h._id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-500/30 to-purple-600/30" />
              <CardHeader>
                <CardTitle className="text-lg">{h.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">{h.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary font-semibold">${h.pricePerNight}/night</span>
                  <Button size="sm" onClick={() => navigate(`/hotels/${h._id}`)}>View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
