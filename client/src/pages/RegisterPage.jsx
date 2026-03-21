import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function RegisterPage() {
  const { register, error, clearError } = useAuth()
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Customer")
  const [loading, setLoading] = useState(false)

  // const onSubmit = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   const res = await register({ name, email, password, role })
  //   setLoading(false)
  //   if (res.success) {
  //     if (res.user?.role === 'Admin') navigate('/admin')
  //     else navigate('/')
  //   }
  // }
   const onSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setLoading(true)
    const res = await register({ name, email, password, role })
    setLoading(false)
    if (res.success) {
      if (res.user?.role === 'Admin') navigate('/admin')
      else navigate('/')
    } else if (res.errors && Array.isArray(res.errors)) {
      // Map backend errors to fieldErrors state
      // const errorsObj = {}
      // res.errors.forEach(err => {
      //   if (err.field) errorsObj[err.field] = err.message
      // })
      // setFieldErrors(errorsObj)
      console.log("Errors are:",res.errors);
      const errorsObj = {}

      res.errors.forEach(err => {
        if (!err.field) return

        if (!errorsObj[err.field]) {
          errorsObj[err.field] = []
        }

        errorsObj[err.field].push(err.message)
      })

      setFieldErrors(errorsObj)
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
          {/* {fieldErrors.name && <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>} */}
          {fieldErrors.name?.map((err, i) => (
            <p key={i} className="text-xs text-destructive mt-1">{err}</p>
          ))}
        </div>


        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={clearError} required />
          {/* {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>} */}
          
          {fieldErrors.email?.map((err, i) => (
            <p key={i} className="text-xs text-destructive mt-1">{err}</p>
          ))}

        </div>


        <div>
          <label className="block text-sm mb-1">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={clearError} required />
          <div className="text-xs mt-2 space-y-1">
            <p className={password.length >= 6 ? "text-green-500" : "text-gray-400"}>
              • At least 6 characters
            </p>
            <p className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}>
              • One uppercase letter
            </p>
            <p className={/[a-z]/.test(password) ? "text-green-500" : "text-gray-400"}>
              • One lowercase letter
            </p>
            <p className={/[0-9]/.test(password) ? "text-green-500" : "text-gray-400"}>
              • One number
            </p>
            <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : "text-gray-400"}>
              • One special character
            </p>
          </div>
          {/* {fieldErrors.password && <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>} */}
          {fieldErrors.password?.map((err, i) => (
            <p key={i} className="text-xs text-destructive mt-1">{err}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <select className="w-full h-10 rounded-md bg-background/50 border border-input px-3" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Customer</option>
            <option>Admin</option>
          </select>
          {fieldErrors.role?.map((err, i) => (
            <p key={i} className="text-xs text-destructive mt-1">{err}</p>
          ))}
          {/* {fieldErrors.role && <p className="text-xs text-destructive mt-1">{fieldErrors.role}</p>} */}
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
