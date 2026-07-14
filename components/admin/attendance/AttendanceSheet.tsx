'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'

type EventSeverity = 'green' | 'amber' | 'red' | 'blue'

interface HardwareEvent {
  id: string
  time: string
  message: string
  severity: EventSeverity
}

const MOCK_EVENTS: HardwareEvent[] = [
  { id: '1', time: '07:25', message: 'System auto-recovery successful', severity: 'green' },
  { id: '2', time: '07:20', message: 'Camera thermal sensor error - temperature high', severity: 'red' },
  { id: '3', time: '07:18', message: 'Network connection restored. Syncing...', severity: 'amber' },
  { id: '4', time: '07:15', message: 'Network connection dropped. Switched to offline mode.', severity: 'red' },
  { id: '5', time: '07:03', message: 'Offline queue synced (12 records)', severity: 'green' },
  { id: '6', time: '07:01', message: 'Worker verified via facial recognition', severity: 'blue' },
]

export function AttendanceSheet({
  sites,
}: {
  sites: { id: string; name: string; code: string }[]
}) {
  const [events, setEvents] = useState<HardwareEvent[]>([])

  useEffect(() => {
    // Simulate live feed
    setEvents(MOCK_EVENTS)
    const timer = setInterval(() => {
      setEvents(prev => {
        const newEvent = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: 'Routine health check passed',
          severity: 'green' as EventSeverity
        }
        return [newEvent, ...prev].slice(0, 50)
      })
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader
        title="Live Event Feed"
        description="Real-time hardware and system events."
        action={
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="text-xs font-semibold text-green-600">LIVE</span>
          </div>
        }
      />
      <CardContent>
        <div className="space-y-0">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
              {event.severity === 'green' && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
              {event.severity === 'amber' && <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />}
              {event.severity === 'red' && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
              {event.severity === 'blue' && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{event.time}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${
                    event.severity === 'green' ? 'bg-green-100 text-green-700' :
                    event.severity === 'amber' ? 'bg-amber-100 text-amber-700' :
                    event.severity === 'red' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {event.severity === 'blue' ? 'info' : event.severity}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500">{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
