'use client'

import { useState } from 'react'
import { api } from '../../../lib/api'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'

export default function AdminImport() {
  const [result, setResult] = useState<any>(null)

  return (
    <Card className='space-y-4'>
      <div>
        <h1 className='text-2xl font-semibold'>Admin import</h1>
        <p className='text-sm text-slate-500'>Seed the default dataset or upload additional opportunities.</p>
      </div>
      <Button onClick={async () => setResult(await api.runSeed())}>Run seed import</Button>
      <Input type='file' onChange={async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setResult(await api.importFile(file))
      }} />
      {result ? <pre className='max-h-80 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-white'>{JSON.stringify(result, null, 2)}</pre> : null}
    </Card>
  )
}
