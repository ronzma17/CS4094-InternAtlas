import { ReactNode } from 'react'
import { Card } from './Card'

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className='border-dashed text-center'>
      <h3>{title}</h3>
      <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      {action ? <div className='mt-4'>{action}</div> : null}
    </Card>
  )
}
