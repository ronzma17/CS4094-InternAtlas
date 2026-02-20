'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
const stages = ['Interested','Applied','OA','Interview','Offer','Rejected']
export default function Tracker(){
  const [apps,setApps]=useState<any[]>([])
  const load=()=>api('/tracker/applications').then(setApps)
  useEffect(()=>{load()},[])
  return <div><h1 className='text-xl font-bold mb-2'>Tracker</h1><button onClick={async()=>{await api('/tracker/applications',{method:'POST',body:JSON.stringify({title_snapshot:'Custom',org_snapshot:'Org',stage:'Interested',notes:''})});load()}}>Add</button>
  <div className='grid grid-cols-3 gap-2 mt-2'>{stages.map(stage=><div key={stage} className='bg-white border rounded p-2'><h2 className='font-semibold'>{stage}</h2>{apps.filter(a=>a.stage===stage).map(a=><div key={a.id} className='border rounded p-2 mt-2'><p>{a.title_snapshot}</p><select value={a.stage} onChange={async e=>{await api(`/tracker/applications/${a.id}/stage`,{method:'PATCH',body:JSON.stringify({stage:e.target.value})});load()}}>{stages.map(s=><option key={s}>{s}</option>)}</select></div>)}</div>)}</div></div>
}
