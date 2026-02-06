import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <div className="text-sm text-muted-foreground">Role: {user?.role}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon: your active and past bookings.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon: your favorite hotels.</p>
        </CardContent>
      </Card>
    </div>
  )
}
