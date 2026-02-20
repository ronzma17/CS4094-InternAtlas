'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'
export default function Signup(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const r=useRouter();
  return <div className='space-y-2'><h1 className='text-xl font-bold'>Sign up</h1><input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/><input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)}/><button onClick={async()=>{try{await api('/auth/register',{method:'POST',body:JSON.stringify({email,password})});r.push('/opportunities')}catch(e:any){setErr(e.message)}}}>Create account</button><p>{err}</p></div>
}
