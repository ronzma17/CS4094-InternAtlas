import { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className='rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='mt-1 text-sm text-slate-500'>{description}</p>
      {action ? <div className='mt-4'>{action}</div> : null}
    </div>
  )
}
