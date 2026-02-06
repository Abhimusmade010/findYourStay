import axios from 'axios'
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
}

// Hotels API
export const hotelsAPI = {
  getAll: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  search: (searchParams) => api.post('/hotels/search', searchParams),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  getMine: () => api.get('/hotels/mine/list'),
}

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getHistory: () => api.get('/bookings/history'),
  getActive: () => api.get('/bookings/active'),
  getPending: () => api.get('/bookings/pending'),
  approve: (id) => api.post(`/bookings/${id}/approve`),
  deny: (id) => api.post(`/bookings/${id}/deny`),
  getOwned: () => api.get('/bookings/owned/confirmed'),
}

// Reviews API
export const reviewsAPI = {
  add: (reviewData) => api.post('/reviews', reviewData),
  getByHotel: (hotelId) => api.get(`/reviews/hotel/${hotelId}`),
}

// Wishlist API
export const wishlistAPI = {
  add: (hotelId) => api.post('/wishlist', { hotelId }),
  remove: (hotelId) => api.delete('/wishlist', { data: { hotelId } }),
  get: () => api.get('/wishlist'),
}

export default api
