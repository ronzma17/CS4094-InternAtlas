'use client'

import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

export default function Insights() {
  const [funnel, setFunnel] = useState<any>(null)
  const [krs, setKrs] = useState<any>(null)
  const [weekly, setWeekly] = useState<Array<{ week: string; count: number }> | null>(null)
  const toast = useToast()

  useEffect(() => {
    Promise.all([api.funnel(), api.krs(), api.appsPerWeek()]).then(([f, k, w]) => {
      setFunnel(f)
      setKrs(k)
      setWeekly(w)
    })
  }, [])

  if (!funnel || !krs || !weekly) return <div className='space-y-2'><Skeleton className='h-24' /><Skeleton className='h-48' /></div>

  const max = Math.max(1, ...weekly.map((item) => item.count))

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Insights</h1>
        <Button onClick={async () => { await api.exportCsv(); toast('Export started') }}>Export CSV</Button>
      </div>

      <div className='grid gap-3 md:grid-cols-4'>
        <Card><p className='text-xs text-slate-500'>Tracked %</p><p className='text-2xl font-semibold'>{krs.tracked_pct}</p></Card>
        <Card><p className='text-xs text-slate-500'>P95 match latency</p><p className='text-2xl font-semibold'>{krs.match_latency_p95}ms</p></Card>
        <Card><p className='text-xs text-slate-500'>Relevance avg</p><p className='text-2xl font-semibold'>{krs.relevance_avg}</p></Card>
        <Card><p className='text-xs text-slate-500'>TTS-10</p><p className='text-2xl font-semibold'>{krs.time_to_shortlist_10 ?? '—'}</p></Card>
      </div>

      <Card>
        <h2 className='mb-3 font-semibold'>Funnel</h2>
        <div className='grid gap-2 md:grid-cols-3'>
          {Object.entries(funnel.counts).map(([stage, count]) => <div key={stage} className='rounded border p-2 dark:border-slate-700'><p className='text-xs text-slate-500'>{stage}</p><p className='text-lg font-semibold'>{count as number}</p></div>)}
        </div>
      </Card>

      <Card>
        <h2 className='mb-3 font-semibold'>Applications per week</h2>
        {weekly.length === 0 ? <EmptyState title='No activity yet' description='Add applications to populate weekly insights.' /> : (
          <div className='flex h-40 items-end gap-2'>
            {weekly.map((item) => <div key={item.week} className='group flex-1'><div className='rounded-t bg-indigo-500 transition hover:bg-indigo-400' style={{ height: `${(item.count / max) * 100}%` }} /><p className='mt-1 truncate text-[10px] text-slate-500'>{item.week}</p></div>)}
          </div>
        )}
      </Card>
    </div>
  )
}
