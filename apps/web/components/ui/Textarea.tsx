import { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn('w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-slate-700 dark:bg-slate-950', props.className)} />
}
