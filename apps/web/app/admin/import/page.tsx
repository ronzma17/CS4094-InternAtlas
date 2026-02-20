'use client'
import { useState } from 'react'
export default function AdminImport(){
  const [msg,setMsg]=useState('')
  async function runSeed(){ const r=await fetch('/api/admin/seed',{method:'POST',credentials:'include'}); setMsg(await r.text()) }
  async function upload(file: File){
    const fd = new FormData(); fd.append('file', file)
    const r = await fetch('/api/admin/import',{method:'POST',body:fd,credentials:'include'})
    setMsg(await r.text())
  }
  return <div className='space-y-2'><h1 className='text-xl font-bold'>Admin Import</h1><button onClick={runSeed}>Run Seed</button><input type='file' onChange={e=>e.target.files&&upload(e.target.files[0])}/><pre>{msg}</pre></div>
}
