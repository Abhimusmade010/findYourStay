import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { hotelsAPI } from '../lib/api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, MapPin, Star } from 'lucide-react'

// Common amenities to show as quick toggles
const AMENITY_OPTIONS = [
  'WiFi', 'Pool', 'Parking', 'Gym', 'Restaurant', 'AC', 'Breakfast'
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name',       label: 'Name A–Z' },
]

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(true)

  // ── Filter state (all from URL on first load) ──────────────
  const [q,          setQ]          = useState(searchParams.get('q')          || '')
  const [city,       setCity]       = useState(searchParams.get('city')       || '')
  const [state,      setState]      = useState(searchParams.get('state')      || '')
  const [country,    setCountry]    = useState(searchParams.get('country')    || '')
  const [minPrice,   setMinPrice]   = useState(searchParams.get('minPrice')   || '')
  const [maxPrice,   setMaxPrice]   = useState(searchParams.get('maxPrice')   || '')
  const [sortBy,     setSortBy]     = useState(searchParams.get('sortBy')     || 'newest')
  const [available,  setAvailable]  = useState(searchParams.get('available')  || '')
  const [amenities,  setAmenities]  = useState(searchParams.getAll('amenities') || [] )


  const buildFilters = () => {
    const f = {}
    if (q)          f.q          = q
    if (city)       f.city       = city
    if (state)      f.state      = state
    if (country)    f.country    = country
    if (minPrice)   f.minPrice   = minPrice
    if (maxPrice)   f.maxPrice   = maxPrice
    if (sortBy)     f.sortBy     = sortBy
    if (available)  f.available  = available
    // axios serialises arrays as amenities=WiFi&amenities=Pool automatically
    if (amenities.length) f.amenities = amenities
    return f
  }

  // Sync filters → URL (for bookmarking / back-nav) 
  useEffect(() => {
    const params = {}
    if (q)         params.q         = q
    if (city)      params.city      = city
    if (state)     params.state     = state
    if (country)   params.country   = country
    if (minPrice)  params.minPrice  = minPrice
    if (maxPrice)  params.maxPrice  = maxPrice
    if (sortBy)    params.sortBy    = sortBy
    if (available) params.available = available
    if (amenities.length) params.amenities = amenities
    setSearchParams(params, { replace: true })
  }, [q, city, state, country, minPrice, maxPrice, sortBy, available, amenities])

  // ── Query
  const filters = buildFilters()
  const { data: hotels = [], isLoading, isFetching } = useQuery({
    queryKey: ['hotels-search', filters],
    queryFn: async () => {
      const res = await hotelsAPI.search(filters)
      // Backend returns { myhotels: { hotels: [...] } }
      return res.data.myhotels?.hotels || res.data.result?.hotels || []
    },
    keepPreviousData: true,
  })

  // ── Helpers 
  const toggleAmenity = (a) =>
    setAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )

  const clearAll = () => {
    setQ(''); setCity(''); setState(''); setCountry('')
    setMinPrice(''); setMaxPrice('')
    setSortBy('newest'); setAvailable('')
    setAmenities([])
  }

  const hasFilters = q || city || state || country || minPrice ||
    maxPrice || available || amenities.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Find Your Stay</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading ? 'Searching…' : `${hotels.length} hotel${hotels.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Hide' : 'Show'} Filters
          {hasFilters && (
            <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {[q, city, state, country, minPrice, maxPrice, available, ...amenities].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* ── Global search bar ─────────────────────────────── */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name, city, state or description…"
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/60 border border-border/60
                     focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm
                     backdrop-blur-sm transition"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Filters sidebar ─────────────────────────────── */}
        {showFilters && (
          <aside className="lg:col-span-1 space-y-5">
            <div className="glass-effect rounded-xl p-5 space-y-5">

              {/* Clear all */}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="w-full text-xs text-destructive hover:underline text-left font-medium"
                >
                  ✕ Clear all filters
                </button>
              )}

              {/* Location */}
              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Location
                </p>
                <Input
                  placeholder="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="State"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Price / night ($)</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="text-sm"
                    min={0}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Sort by</p>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full rounded-md bg-background/50 border border-input px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Availability</p>
                <div className="flex gap-2">
                  {[
                    { label: 'All',       value: '' },
                    { label: 'Available', value: 'true' },
                    { label: 'Booked',    value: 'false' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setAvailable(opt.value)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition
                        ${available === opt.value
                          ? 'bg-primary text-white border-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {AMENITY_OPTIONS.map(a => (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition
                        ${amenities.includes(a)
                          ? 'bg-primary text-white border-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        )}

        {/* ── Results grid ─────────────────────────────────── */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>

          {/* Sort bar on top of results (mobile-friendly repeat) */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isFetching && !isLoading ? 'Updating…' : `${hotels.length} results`}
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="rounded-md bg-background/50 border border-input px-3 py-1.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/30 lg:hidden"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            // Skeleton cards
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden glass-effect animate-pulse">
                  <div className="h-44 bg-secondary/40" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-secondary/60 rounded w-3/4" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                    <div className="h-8 bg-secondary/30 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="glass-effect rounded-xl p-16 text-center space-y-3">
              <div className="text-5xl">🏨</div>
              <p className="text-lg font-semibold">No hotels found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
              {hasFilters && (
                <Button variant="outline" size="sm" onClick={clearAll} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotels.map(h => {
                // Availability badge based on bookedDates
                const today = new Date(); today.setHours(0, 0, 0, 0)
                const isTodayBooked = Array.isArray(h.bookedDates) && h.bookedDates.some(range => {
                  if (!Array.isArray(range) || range.length === 0) return false
                  const start = new Date(range[0]); start.setHours(0, 0, 0, 0)
                  const end   = new Date(range[range.length - 1]); end.setHours(0, 0, 0, 0); end.setDate(end.getDate() + 1)
                  return today >= start && today < end
                })

                return (
                  <Card
                    key={h._id}
                    className="overflow-hidden group hover:shadow-xl hover:shadow-primary/10
                               transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate(`/hotels/${h._id}`)}
                  >
                    {/* Image / placeholder */}
                    <div className="relative h-44 bg-gradient-to-br from-blue-500/30 to-purple-600/30 overflow-hidden">
                      {h.images?.[0]?.url ? (
                        <img
                          src={h.images[0].url}
                          alt={h.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏨</div>
                      )}
                      {/* Availability badge */}
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${isTodayBooked
                          ? 'bg-red-500/90   text-white'
                          : 'bg-emerald-500/90 text-white'}`}>
                        {isTodayBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>

                    <CardHeader className="pb-1 pt-4">
                      <CardTitle className="text-base leading-tight">{h.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 {h.location?.city}{h.location?.country ? `, ${h.location.country}` : ''}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Amenity tags (up to 3) */}
                      {h.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {h.amenities.slice(0, 3).map(a => (
                            <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">
                              {a}
                            </span>
                          ))}
                          {h.amenities.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">
                              +{h.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-primary font-bold text-lg">${h.pricePerNight}</span>
                          <span className="text-muted-foreground text-xs">/night</span>
                        </div>
                        <Button
                          size="sm"
                          variant="gradient"
                          onClick={e => { e.stopPropagation(); navigate(`/hotels/${h._id}`) }}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
