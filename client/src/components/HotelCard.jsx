import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { useNavigate } from 'react-router-dom'

export default function HotelCard({ hotel }) {
  const navigate = useNavigate()
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-blue-500/30 to-purple-600/30" />
      <CardHeader>
        <CardTitle className="text-lg">{hotel.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground truncate">{hotel.location?.city}, {hotel.location?.country}</div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-semibold">${hotel.pricePerNight}/night</span>
          <Button size="sm" onClick={() => navigate(`/hotels/${hotel._id}`)}>Details</Button>
        </div>
      </CardContent>
    </Card>
  )
}
