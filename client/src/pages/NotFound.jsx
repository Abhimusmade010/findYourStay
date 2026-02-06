import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">The page you are looking for could not be found.</p>
      <Link to="/">
        <Button variant="gradient">Back to Home</Button>
      </Link>
    </div>
  )
}
