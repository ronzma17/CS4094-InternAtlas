'use client'
import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'
export default function OppDetail({params}:{params:{id:string}}){
  const [opp,setOpp]=useState<any>(null)
  useEffect(()=>{api(`/opportunities/${params.id}`).then(setOpp)},[params.id])
  if(!opp) return <div>Loading...</div>
  return <div className='space-y-2'><h1 className='text-xl font-bold'>{opp.title}</h1><p>{opp.org} • {opp.location}</p><p>{opp.description}</p>
    <div>{(opp.explanation?.snippets||[]).map((s:string,i:number)=><p key={i} dangerouslySetInnerHTML={{__html:s}} />)}</div>
    <button onClick={()=>api(`/opportunities/${params.id}/save`,{method:'POST'})}>Save</button>
    <div className='flex gap-1'>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>api(`/opportunities/${params.id}/rate`,{method:'POST',body:JSON.stringify({rating:n})})}>{n}</button>)}</div>
  </div>
}
