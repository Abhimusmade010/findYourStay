import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hotelsAPI, reviewsAPI, wishlistAPI } from '../lib/api'
import { useToast } from '../components/ui/Toast'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Carousel from '../components/Carousel'
import Map from '../components/Map'
import Calendar from '../components/Calendar'

export default function HotelDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
      // queryFn: async () => (await hotelsAPI.getById(id)).data.hotel
    queryFn:async()=>{
      const result=await hotelsAPI.getById(id);
      console.log("result in get hotel details is ",result);
      console.log("detials is ",result.data.hotel);
      return result.data.hotel;
    }
  })

 
  const { data: reviews = [] } = useQuery({
    queryKey: ['hotel-reviews', id],
    queryFn: async () => (await reviewsAPI.getByHotel(id)).data

    
  })
  
  const { data: past = [] } = useQuery({
    queryKey: ['bookings', 'history'],
    queryFn: async () => (await (await import('../lib/api')).bookingsAPI.getHistory()).data
  })

  const qc = useQueryClient()
  const reviewMutation = useMutation({
    mutationFn: async ({ rating, comment }) => (await reviewsAPI.add({ hotelId: id, rating, comment })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hotel-reviews', id] })
      success('Review added')
      setRating(5)
      setComment('')
    },
    onError: (e) => error(e?.response?.data?.message || 'Failed to add review')
  })

  const canReview = Array.isArray(past) && past.some(b => b?.hotel?._id === id)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  if (isLoading) return <div className="max-w-5xl mx-auto px-6 py-10">Loading...</div>

  const images = hotel?.images?.length ? hotel.images : undefined
  console.log("hotel data is ",hotel)
  console.log("hotel description is ",hotel.hotel.description)
  console.log("hotel description is ",hotel.hotel.location.state);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{hotel.hotel.name}</h1>
        <p className="text-muted-foreground">{hotel.hotel.location?.city}, {hotel.hotel.location?.state}, {hotel.hotel.location?.country}</p>
        <Carousel images={images}/>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{hotel.hotel.description}</p>
            
            {hotel.hotel.amenities?.length ? (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.hotel.amenities.map((a, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-sm bg-secondary/60">{a}</span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <Calendar bookedDates={hotel.hotel.bookedDates || []} />
              </div>
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <Map query={`${hotel.hotel.name} ${hotel.hotel.location?.city || ''}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Book your stay</CardTitle>
              {(() => {
                const today = new Date()
                today.setHours(0,0,0,0)
                const isTodayBooked = Array.isArray(hotel.hotel.bookedDates) && hotel.hotel.bookedDates.some(range => {
                  if (!Array.isArray(range) || range.length === 0) return false
                  const start = new Date(range[0])
                  start.setHours(0,0,0,0)
                  const endExclusive = new Date(range[range.length - 1])
                  endExclusive.setHours(0,0,0,0)
                  endExclusive.setDate(endExclusive.getDate() + 1)
                  return today >= start && today < endExclusive
                })
                return isTodayBooked ? (
                  <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Booked Today</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Available</span>
                )
              })()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${hotel.hotel.pricePerNight}<span className="text-sm text-muted-foreground"> / night</span></div>
            <Button className="w-full mt-4" variant="gradient" onClick={() => navigate(`/booking/${hotel.hotel._id}`)}>Book Now</Button>
            <Button
              className="w-full mt-2"
              variant="outline"
              onClick={async () => {
                try {
                  await wishlistAPI.add(hotel.hotel._id)
                  success('Hotel added to wishlist')
                } catch (e) {
                  // console.log("error message is ",e.data.message)
                  error(e?.response?.data?.error || 'Failed to add to wishlist')
                }
              }}
            >
              Add to Wishlist
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {canReview ? (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-sm mb-1">Rating</label>
                <input type="number" min="1" max="5" value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Comment</label>
                <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Share your experience" className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
              </div>
              <Button onClick={()=> reviewMutation.mutate({ rating, comment })} disabled={reviewMutation.isPending || !comment.trim()} variant="gradient">{reviewMutation.isPending? 'Posting...' : 'Post Review'}</Button>
            </div>
          ) : null}
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="p-4 rounded-lg bg-secondary/40">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.customer?.name || 'Guest'}</div>
                    <div className="text-primary">{r.rating} / 5</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
