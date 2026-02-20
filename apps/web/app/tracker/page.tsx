'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { useToast } from '../../components/ui/Toast'

const stages = ['Interested', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected']

export default function Tracker() {
  const [apps, setApps] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const toast = useToast()

  const load = () => api.trackerList().then(setApps)
  useEffect(() => {
    load()
  }, [])

  const grouped = useMemo(() => stages.map((stage) => ({ stage, items: apps.filter((app) => app.stage === stage) })), [apps])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Application tracker</h1>
        <Button onClick={async () => { await api.trackerCreate({ title_snapshot: 'New application', org_snapshot: 'Company', stage: 'Interested' }); toast('Application created'); load() }}>Add application</Button>
      </div>

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
        {grouped.map((column) => (
          <Card key={column.stage}>
            <h2 className='mb-3 font-semibold'>{column.stage}</h2>
            <div className='space-y-2'>
              {column.items.length === 0 ? <EmptyState title='Nothing here yet' description='Move opportunities into this stage.' /> : column.items.map((item) => (
                <div key={item.id} className='rounded-lg border p-3 dark:border-slate-700'>
                  <p className='font-medium'>{item.title_snapshot}</p>
                  <p className='text-xs text-slate-500'>{item.org_snapshot}</p>
                  <div className='mt-2 flex gap-2'>
                    <Select value={item.stage} onChange={async (e) => { await api.trackerPatchStage(item.id, e.target.value); load() }}>
                      {stages.map((stage) => <option key={stage}>{stage}</option>)}
                    </Select>
                    <Button className='px-2 py-1' onClick={() => setEditing(item)}>Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(editing)} title='Edit tracker item' onClose={() => setEditing(null)}>
        {editing ? (
          <form className='space-y-3' onSubmit={async (e) => {
            e.preventDefault()
            const form = new FormData(e.currentTarget)
            await api.trackerPatch(editing.id, {
              notes: form.get('notes'),
              deadline: form.get('deadline') || null,
              date_applied: form.get('date_applied') || null,
            })
            toast('Tracker item updated')
            setEditing(null)
            load()
          }}>
            <Textarea name='notes' defaultValue={editing.notes || ''} placeholder='Notes' />
            <Input type='date' name='deadline' defaultValue={editing.deadline_date || ''} />
            <Input type='date' name='date_applied' defaultValue={editing.date_applied || ''} />
            <div className='flex gap-2'>
              <Button type='submit'>Save changes</Button>
              <Button type='button' className='bg-red-600 hover:bg-red-500' onClick={async () => { await api.trackerDelete(editing.id); toast('Tracker item deleted'); setEditing(null); load() }}>Delete</Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
