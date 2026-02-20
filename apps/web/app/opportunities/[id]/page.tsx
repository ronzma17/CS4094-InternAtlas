'use client'

import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useToast } from '../../../components/ui/Toast'

export default function OppDetail({ params }: { params: { id: string } }) {
  const [opp, setOpp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    api.getOpportunity(params.id).then(setOpp).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <Skeleton className='h-52' />
  if (!opp) return <Card>Not found.</Card>

  return (
    <div className='space-y-4'>
      <Card>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-2xl font-semibold'>{opp.title}</h1>
            <p className='text-sm text-slate-500'>{opp.org} • {opp.location} • {opp.deadline_date ?? 'No deadline'}</p>
          </div>
          <Badge>Match {opp.match_score}</Badge>
        </div>
        <p className='mt-4 text-sm leading-6'>{opp.description}</p>
      </Card>

      <Card>
        <h2 className='font-semibold'>Why this matches</h2>
        <div className='mt-2 flex flex-wrap gap-2'>
          {(opp.explanation?.overlap_skills || []).map((skill: string) => <Badge key={skill}>{skill}</Badge>)}
        </div>
        <div className='mt-3 space-y-2 text-sm'>
          {(opp.explanation?.snippets || []).map((snippet: string, idx: number) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: snippet }} className='rounded border p-2 [&_mark]:bg-yellow-200' />
          ))}
        </div>
      </Card>

      <Card className='flex flex-wrap items-center gap-3'>
        <Button onClick={async () => { await api.saveOpportunity(params.id); toast('Saved opportunity') }}>Save</Button>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Rate relevance:</span>
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button key={rating} className='px-2 py-1' onClick={async () => { await api.rateOpportunity(params.id, rating); toast(`Rated ${rating}/5`) }}>
              {rating}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
