import { useQuery, useQueryClient } from '@tanstack/react-query'
import { wishlistAPI } from '../lib/api'
import HotelCard from '../components/HotelCard'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await wishlistAPI.get()).data
    // queryFn:async()=>{
    //   const result=await wishlistAPI.get();
    //   console.log("data in wishlist is:",result);
    //   return result
    // }

  })
  console.log("wishlist data is ",data)
  const hotels = data?.wishlist || []

  const handleRemove = async (hotelId) => {
    try {
      await wishlistAPI.remove(hotelId)
      success('Hotel removed from wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    } catch (e) {
      error(e?.response?.data?.message || 'Failed to remove from wishlist')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : hotels.length === 0 ? (
        <p className="text-muted-foreground">No favorites yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {hotels.map(h => (
            <div key={h._id} className="relative">
              <HotelCard hotel={h} />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-3 right-3"
                onClick={() => handleRemove(h._id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
