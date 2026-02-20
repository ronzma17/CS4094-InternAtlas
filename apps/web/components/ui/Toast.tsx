'use client'
import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext<(message: string) => void>(() => {})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const show = (value: string) => {
    setMessage(value)
    setTimeout(() => setMessage(''), 2200)
  }
  const value = useMemo(() => show, [])
  return (
    <ToastContext.Provider value={value}>
      {children}
      {message ? <div className='fixed bottom-4 right-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white'>{message}</div> : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
