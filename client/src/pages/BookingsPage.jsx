import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'

export default function BookingsPage() {
  const { user } = useAuth()
  const { error: showError, success: showSuccess } = useToast()
  const qc = useQueryClient()
  const isAdmin = user?.role === 'Admin'
  const [activeTab, setActiveTab] = useState('mine')

  const { data: active = [] } = useQuery({
    queryKey: ['bookings', 'active'],
    queryFn: async () => (await bookingsAPI.getActive()).data
  })

  const { data: history = [] } = useQuery({
    queryKey: ['bookings', 'history'],
    queryFn: async () => (await bookingsAPI.getHistory()).data
  })

  // NOTE: enabled is passed as an option to useQuery (not destructured)
  const { data: pending = [] } = useQuery({
    queryKey: ['bookings', 'pending'],
    // queryFn: async () => (await bookingsAPI.getPending()).data,
    queryFn:async()=>{
      const result=await bookingsAPI.getPending();
      console.log("In pending of frontend result of getPOending axios api is",result.data.result)
      return result.data.result
    },

    enabled: isAdmin

  })
  // console.log("response after get pending",response.result)
  const { data: owned = [] } = useQuery({
    queryKey: ['bookings', 'owned'],
    queryFn: async () => (await bookingsAPI.getOwned()).data,
    enabled: isAdmin
  })

  const approveMutation = useMutation({
    mutationFn: async (id) => (await bookingsAPI.approve(id)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'pending'] })
      showSuccess('Booking approved')
    },
    onError: (e) => showError(e?.response?.data?.message || 'Failed to approve')
  })

  const denyMutation = useMutation({
    mutationFn: async (id) => (await bookingsAPI.deny(id)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings', 'pending'] })
      showSuccess('Booking denied')
    },
    onError: (e) => showError(e?.response?.data?.message || 'Failed to deny')
  })

  const TabButton = ({ id, label }) => (
    <Button variant={activeTab === id ? 'gradient' : 'outline'} size="sm" onClick={() => setActiveTab(id)}>
      {label}
    </Button>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center gap-2">
        <TabButton id="mine" label="My Bookings" />
        <TabButton id="history" label="History" />
        {isAdmin ? <>
          <TabButton id="pending" label="Pending (Admin)" />
          <TabButton id="owned" label="Confirmed (Admin)" />
        </> : null}
      </div>

      {activeTab === 'mine' && (
        <Card>
          <CardHeader><CardTitle>Active & Upcoming</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {active.length === 0 ? <p className="text-sm text-muted-foreground">No active bookings.</p> : active.map(b => (
              <div key={b._id} className="glass-effect rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{b.hotel?.name}</div>
                  <div className="text-sm text-muted-foreground">{new Date(b.checkIn).toDateString()} → {new Date(b.checkOut).toDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${b.status === 'Confirmed' ? 'bg-emerald-600 text-white' : b.status === 'Pending' ? 'bg-amber-600 text-white' : 'bg-muted text-foreground'}`}>{b.status}</span>
                  <span className="text-primary font-semibold">${b.totalPrice}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader><CardTitle>Past Bookings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {history.length === 0 ? <p className="text-sm text-muted-foreground">No past bookings.</p> : history.map(b => (
              <div key={b._id} className="glass-effect rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{b.hotel?.name}</div>
                  <div className="text-sm text-muted-foreground">{new Date(b.checkIn).toDateString()} → {new Date(b.checkOut).toDateString()}</div>
                </div>
                <div className="text-muted-foreground">{b.status}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isAdmin && activeTab === 'pending' && (
        <Card>
          <CardHeader><CardTitle>Pending Requests (Your Hotels)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {pending.length === 0 ? <p className="text-sm text-muted-foreground">No pending requests.</p> : pending.map(b => (
              <div key={b._id} className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.hotel?.name}</div>
                    <div className="text-sm text-muted-foreground">{new Date(b.checkIn).toDateString()} → {new Date(b.checkOut).toDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* use isLoading (mutation) rather than isPending */}
                    <Button size="sm" variant="outline" onClick={() => denyMutation.mutate(b._id)} disabled={denyMutation.isLoading}>Deny</Button>
                    <Button size="sm" variant="gradient" onClick={() => approveMutation.mutate(b._id)} disabled={approveMutation.isLoading}>Approve</Button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  User: {b.customer?.name} ({b.customer?.email})
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isAdmin && activeTab === 'owned' && (
        <Card>
          <CardHeader><CardTitle>Confirmed Bookings (Your Hotels)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {owned.length === 0 ? <p className="text-sm text-muted-foreground">No confirmed bookings.</p> : owned.map(b => (
              <div key={b._id} className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.hotel?.name}</div>
                    <div className="text-sm text-muted-foreground">{new Date(b.checkIn).toDateString()} → {new Date(b.checkOut).toDateString()}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">User: {b.customer?.name} ({b.customer?.email})</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
