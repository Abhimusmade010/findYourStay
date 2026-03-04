import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsAPI } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

export default function NotificationsPage() {
  const { error: showError, success: showSuccess } = useToast()
  const qc = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await notificationsAPI.getAll()).data.result,
  })

  const markReadMutation = useMutation({
    mutationFn: async (id) => (await notificationsAPI.markRead(id)).data.result,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      showSuccess('Marked as read')
    },
    onError: (e) => showError(e?.response?.data?.message || 'Failed to mark read')
  })

  if (isLoading) return <p className="text-center py-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have no notifications.</p>
          ) : (
            notifications.map(n => (
              <div
                key={n._id}
                className={`border rounded-lg p-4 flex justify-between items-center ${n.read ? 'bg-black' : 'bg-black'}`}>
                <div>
                  <p>{n.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markReadMutation.mutate(n._id)}
                    disabled={markReadMutation.isLoading}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
