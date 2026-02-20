'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
export default function Insights(){
  const [f,setF]=useState<any>(null); const [k,setK]=useState<any>(null)
  useEffect(()=>{api('/insights/funnel').then(setF);api('/metrics/krs').then(setK)},[])
  return <div className='space-y-2'><h1 className='text-xl font-bold'>Insights</h1>
  <pre>{JSON.stringify(f,null,2)}</pre>
  <pre>{JSON.stringify(k,null,2)}</pre>
  <a className='underline' href='/api/insights/export.csv'>Export CSV</a></div>
}
