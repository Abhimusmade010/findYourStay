import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Customer")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await register({ name, email, password, role })
    setLoading(false)
    if (res.success) {
      if (res.user?.role === 'Admin') navigate('/admin')
      else navigate('/')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md glass-effect rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
        {error ? <p className="text-sm text-destructive text-center">{error}</p> : null}
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} onFocus={clearError} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={clearError} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={clearError} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select className="w-full h-10 rounded-md bg-background/50 border border-input px-3" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Customer</option>
            <option>Admin</option>
          </select>
        </div>
        <Button type="submit" className="w-full" variant="gradient" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
