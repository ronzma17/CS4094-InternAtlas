'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
export default function Opportunities(){
  const [items,setItems]=useState<any[]>([]); const [q,setQ]=useState('');
  const load=()=>api(`/opportunities?query=${encodeURIComponent(q)}`).then(setItems).catch(()=>setItems([]));
  useEffect(()=>{load()},[])
  return <div><h1 className='text-xl font-bold mb-2'>Opportunities</h1><div className='flex gap-2 mb-2'><input value={q} onChange={e=>setQ(e.target.value)} placeholder='search'/><button onClick={load}>Search</button></div><div className='space-y-2'>{items.map((o)=><div key={o.id} className='bg-white p-3 rounded border'><div className='flex justify-between'><Link className='font-semibold underline' href={`/opportunities/${o.id}`}>{o.title}</Link><span>{o.match_score}</span></div><p>{o.org} • {o.location} • {o.deadline_date}</p><p className='text-sm'>Overlap: {(o.explanation?.overlap_skills||[]).join(', ')}</p></div>)}</div></div>
}
