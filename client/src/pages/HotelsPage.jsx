import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { hotelsAPI } from '../lib/api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useState, useMemo } from 'react'

export default function HotelsPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState(params.get('city') || '')

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => (await hotelsAPI.getAll()).data,
  })

  const filtered = useMemo(() => {
    return hotels.filter(h => {
      const priceOk = (!minPrice || h.pricePerNight >= Number(minPrice)) && (!maxPrice || h.pricePerNight <= Number(maxPrice))
      const cityOk = !city || (h.location?.city || '').toLowerCase().includes(city.toLowerCase())
      return priceOk && cityOk
    })
  }, [hotels, minPrice, maxPrice, city])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="glass-effect rounded-xl p-4 h-fit">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-3">
            <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <Input placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <Button variant="gradient" onClick={() => setParams({ city })}>Apply</Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <p className="text-muted-foreground">Loading hotels...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(h => (
                <Card key={h._id} className="overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-blue-500/30 to-purple-600/30">
                    {(() => {
                      const today = new Date(); today.setHours(0,0,0,0)
                      const isTodayBooked = Array.isArray(h.bookedDates) && h.bookedDates.some(range => {
                        if (!Array.isArray(range) || range.length === 0) return false
                        const start = new Date(range[0]); start.setHours(0,0,0,0)
                        const endEx = new Date(range[range.length - 1]); endEx.setHours(0,0,0,0); endEx.setDate(endEx.getDate()+1)
                        return today >= start && today < endEx
                      })
                      return isTodayBooked ? (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded bg-red-600 text-white text-xs">Booked</span>
                      ) : (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded bg-emerald-600 text-white text-xs">Available</span>
                      )
                    })()}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{h.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground truncate">{h.location?.city}, {h.location?.country}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-primary font-semibold">${h.pricePerNight}/night</span>
                      <Button size="sm" onClick={() => navigate(`/hotels/${h._id}`)}>Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
