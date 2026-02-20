import { ReactNode } from 'react'

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4'>
      <div className='w-full max-w-lg rounded-xl bg-white p-6 dark:bg-slate-900'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button onClick={onClose} className='text-sm text-slate-500'>Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}
