import { useMemo, useState } from 'react'
import { addDays, endOfMonth, format, isAfter, isBefore, isSameDay, startOfMonth } from 'date-fns'

export default function Calendar({ bookedDates = [] }) {
  const [current, setCurrent] = useState(new Date())

  const ranges = useMemo(() => {
    return bookedDates
      .filter(r => Array.isArray(r) && r.length > 0)
      .map(r => {
        const start = new Date(r[0])
        const endExclusive = new Date(r[r.length - 1])
        endExclusive.setDate(endExclusive.getDate() + 1)
        start.setHours(0,0,0,0); endExclusive.setHours(0,0,0,0)
        return [start, endExclusive]
      })
  }, [bookedDates])

  const isBookedDay = (day) => {
    for (const [s, e] of ranges) {
      if ((isAfter(day, s) || isSameDay(day, s)) && isBefore(day, e)) return true
    }
    return false
  }

  const Month = ({ date }) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const days = []
    const firstWeekday = start.getDay() // 0-6
    for (let i = 0; i < firstWeekday; i++) days.push(null)
    let cur = new Date(start)
    while (cur <= end) {
      days.push(new Date(cur))
      cur = addDays(cur, 1)
    }
    return (
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-b border-border/50 flex items-center justify-between">
          <button onClick={() => setCurrent(addMonthsSafe(current, -1))} className="glass-effect rounded-md px-2 py-1">‹</button>
          <div className="font-semibold">{format(date, 'MMMM yyyy')}</div>
          <button onClick={() => setCurrent(addMonthsSafe(current, 1))} className="glass-effect rounded-md px-2 py-1">›</button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-border/40 p-px">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-xs text-muted-foreground py-2 text-center bg-background/60">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border/40 p-px">
          {days.map((d, i) => d ? (
            <div key={i} className={`h-10 text-sm flex items-center justify-center ${isBookedDay(d) ? 'bg-red-600 text-white' : 'bg-background/60'}`}>
              {d.getDate()}
            </div>
          ) : (
            <div key={i} className="h-10 bg-background/40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Month date={current} />
      <div className="text-xs text-muted-foreground flex items-center gap-3">
        <span className="inline-block w-3 h-3 rounded-sm bg-red-600" /> Booked
        <span className="inline-block w-3 h-3 rounded-sm bg-background/60 border border-border/50" /> Available
      </div>
    </div>
  )
}

function addMonthsSafe(date, delta) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + delta)
  return d
}


