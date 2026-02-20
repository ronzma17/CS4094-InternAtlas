'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  return (
    <Card className='mx-auto max-w-md space-y-3'>
      <h1 className='text-2xl font-semibold'>Login</h1>
      <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={async () => {
        try {
          await api.login({ email, password })
          router.push('/opportunities')
        } catch (e: any) {
          setErr(e.message)
        }
      }}>Login</Button>
      <Link href='/signup' className='text-sm text-indigo-600 underline'>Need an account?</Link>
      {err ? <p className='text-sm text-red-600'>{err}</p> : null}
    </Card>
  )
}
