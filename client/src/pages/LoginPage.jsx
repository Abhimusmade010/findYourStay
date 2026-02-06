import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function LoginPage() {
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.success) {
      if (res.user?.role === 'Admin') navigate('/admin')
      else navigate('/')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-effect rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
        {error ? <p className="text-sm text-destructive text-center">{error}</p> : null}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={clearError} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={clearError} required />
        </div>
        <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          New here? <Link to="/register" className="text-primary">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
