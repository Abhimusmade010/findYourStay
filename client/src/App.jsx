import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { useAuth } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import HotelsPage from './pages/HotelsPage'
import HotelDetailsPage from './pages/HotelDetailsPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import NotFound from './pages/NotFound'
import WishlistPage from './pages/WishlistPage'
import BookingsPage from './pages/BookingsPage'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, loading, user } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Futuristic background layers */}
      <div className="aurora-bg" />
      <div className="grid-overlay" />

      <Navigation />
      <main className="pt-16 min-h-[80vh] relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
