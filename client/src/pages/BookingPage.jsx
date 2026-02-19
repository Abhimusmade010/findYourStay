import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsAPI, hotelsAPI } from '../lib/api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [pickerOpen, setPickerOpen] = useState(null) // 'in' | 'out' | null
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const popRef = useRef(null)

  const { data: hotel } = useQuery({
    queryKey: ['hotel', id],
    // queryFn: async () => (await hotelsAPI.getById(id)).data
    queryFn:async()=>{
          const result=await hotelsAPI.getById(id);
          console.log("result in get hotel details is ",result);
          console.log("detials is ",result.data.hotel);
          return result.data.hotel;
      }
  })
  console.log("aoutside booking page",hotel.hotel.description)


  const isOverlap = useMemo(() => {
    if (!hotel || !Array.isArray(hotel.bookedDates)) return () => false
    const parse = (v) => new Date(v + 'T00:00:00')
    return (startStr, endStr) => {
      if (!startStr || !endStr) return false
      const start = parse(startStr)
      const end = parse(endStr)
      if (!(start instanceof Date) || !(end instanceof Date) || isNaN(start) || isNaN(end)) return false
      // checkout-exclusive new interval [start, end)
      for (const range of hotel.bookedDates) {
        if (!Array.isArray(range) || range.length === 0) continue
        const existingStart = new Date(range[0])
        const existingEndExclusive = new Date(range[range.length - 1])
        existingEndExclusive.setDate(existingEndExclusive.getDate() + 1)
        if (start < existingEndExclusive && existingStart < end) return true
      }
      return false
    }
  }, [hotel])


  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const payload = { hotelId: id, checkIn, checkOut }
      return (await bookingsAPI.create(payload)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      navigate('/profile')
    }
  })

  useEffect(() => {
    function onDocClick(e) {
      if (popRef.current && !popRef.current.contains(e.target)) {
        setPickerOpen(null)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (

    <div className="max-w-xl mx-auto px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Book {hotel.hotel?.name || 'Hotel'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="relative">
              <label className="block text-sm mb-1">Check-in</label>
              <Input type="text" readOnly onFocus={() => setPickerOpen('in')} value={checkIn} placeholder="YYYY-MM-DD" />
            </div>
            <div className="relative">
              <label className="block text-sm mb-1">Check-out</label>
              <Input type="text" readOnly onFocus={() => setPickerOpen('out')} value={checkOut} placeholder="YYYY-MM-DD" />
            </div>

            {pickerOpen && (

              <div ref={popRef} className="absolute z-50 top-full mt-2 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[360px] rounded-xl border border-border/50 bg-background/95 backdrop-blur p-3 shadow-xl">
                <BookingMonth
                  monthDate={currentMonth}
                  setMonthDate={setCurrentMonth}
                  bookedDates={hotel?.bookedDates || []}
                  
                  onSelect={(d) => {
                    const y = d.getFullYear()
                    const m = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')
                    const localStr = `${y}-${m}-${day}`
                    if (pickerOpen === 'in') {
                      setCheckIn(localStr)
                      // auto-adjust checkout to be at least next day
                      const inDate = new Date(`${localStr}T00:00:00`)
                      const outDate = checkOut ? new Date(`${checkOut}T00:00:00`) : null
                      if (!outDate || !(outDate > inDate)) {
                        const next = new Date(inDate)
                        next.setDate(next.getDate() + 1)
                        const ny = next.getFullYear()
                        const nm = String(next.getMonth() + 1).padStart(2, '0')
                        const nd = String(next.getDate()).padStart(2, '0')
                        setCheckOut(`${ny}-${nm}-${nd}`)
                      }
                    } else {
                      if (checkIn) {
                        const inDate = new Date(`${checkIn}T00:00:00`)
                        const selected = new Date(`${localStr}T00:00:00`)
                        if (selected > inDate) setCheckOut(localStr)
                        else {
                          const next = new Date(inDate)
                          next.setDate(next.getDate() + 1)
                          const ny = next.getFullYear()
                          const nm = String(next.getMonth() + 1).padStart(2, '0')
                          const nd = String(next.getDate()).padStart(2, '0')
                          setCheckOut(`${ny}-${nm}-${nd}`)
                        }
                      } else {
                        setCheckOut(localStr)
                      }
                    }
                    setPickerOpen(null)
                  }}

                />
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
                  <span className="inline-block w-3 h-3 rounded-sm bg-red-600" /> Booked
                  <span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Selected
                </div>
              </div>

            )}
          </div>


          {error ? <p className="text-sm text-destructive">{error.response?.data?.message || 'Booking failed'}</p> : null}
          {!checkIn || !checkOut ? (
            <p className="text-sm text-muted-foreground">Select both check-in and check-out dates.</p>
          ) : null}

          {checkIn && checkOut && new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`) ? (
            <p className="text-sm text-destructive">Check-out must be after check-in.</p>
          ) : null}

          {isOverlap(checkIn, checkOut) ? (
            <p className="text-sm text-destructive">Selected dates overlap existing bookings. Please choose different dates.</p>
          ) : null}

          <Button className="w-full" variant="gradient" disabled={
            isPending ||
            !checkIn || !checkOut ||
            new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`) ||
            isOverlap(checkIn, checkOut)
          } onClick={() => mutate()}>
            {isPending ? 'Booking...' : 'Confirm Booking'}
          
          </Button>
          
        </CardContent>
      </Card>
    </div>

  )
}





function BookingMonth({ monthDate, setMonthDate, bookedDates, onSelect }) {
  const start = useMemo(() => new Date(monthDate.getFullYear(), monthDate.getMonth(), 1), [monthDate])
  const end = useMemo(() => new Date(monthDate.getFullYear(), monthDate.getMonth()+1, 0), [monthDate])

  const days = useMemo(() => {
    const firstWeekday = start.getDay()
    const arr = []
    for (let i=0;i<firstWeekday;i++) arr.push(null)
    const cur = new Date(start)
    while (cur <= end) {
      arr.push(new Date(cur))
      cur.setDate(cur.getDate()+1)
    }
    return arr
  }, [start, end])

  const ranges = useMemo(() => {
    return (bookedDates || [])
      .filter(r => Array.isArray(r) && r.length)
      .map(r => {
        const s = new Date(r[0]); s.setHours(0,0,0,0)
        const e = new Date(r[r.length-1]); e.setHours(0,0,0,0); e.setDate(e.getDate()+1)
        return [s,e]
      })
  }, [bookedDates])

  const isBooked = (d) => {
    for (const [s,e] of ranges) {
      if (d >= s && d < e) return true
    }
    return false
  }

  const changeMonth = (delta) => {
    const d = new Date(monthDate)
    d.setMonth(d.getMonth()+delta)
    setMonthDate(d)
  }

  return (
    <div>
      <div className="px-2 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-border/50 rounded-md flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="glass-effect rounded-md px-2 py-1">‹</button>
        <div className="font-semibold">{monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button onClick={() => changeMonth(1)} className="glass-effect rounded-md px-2 py-1">›</button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-px bg-border/40 p-px">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-xs text-muted-foreground py-2 text-center bg-background/60">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border/40 p-px">
        {days.map((d,i) => d ? (
          <button
            key={i}
            onClick={() => !isBooked(d) && onSelect(new Date(d))}
            disabled={isBooked(d)}
            className={`h-10 text-sm flex items-center justify-center ${isBooked(d) ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-background/60 hover:bg-primary/20'} rounded-[2px]`}
          >
            {d.getDate()}
          </button>
        ) : (
          <div key={i} className="h-10 bg-background/40" />
        ))}
      </div>
    </div>
  )
}
