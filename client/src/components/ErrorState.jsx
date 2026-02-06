import { Button } from './ui/Button'

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="w-full flex items-center justify-center py-16">
      <div className="glass-effect rounded-xl p-6 text-center">
        <p className="text-sm text-destructive mb-4">{message}</p>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>Retry</Button>
        ) : null}
      </div>
    </div>
  )
}
