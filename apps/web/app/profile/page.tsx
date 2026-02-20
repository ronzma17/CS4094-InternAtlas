'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
export default function Profile(){
  const [skills,setSkills]=useState(''); const [interests,setInterests]=useState(''); const [locations,setLocations]=useState(''); const [gradYear,setGradYear]=useState('');
  useEffect(()=>{api('/me/profile').then((p)=>{setSkills((p.skills||[]).join(', '));setInterests(p.interests||'');setLocations((p.locations||[]).join(', '));setGradYear(p.grad_year?String(p.grad_year):'')}).catch(()=>{})},[])
  return <div className='space-y-2'><h1 className='text-xl font-bold'>Profile</h1>
  <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder='skills comma separated'/>
  <textarea value={interests} onChange={e=>setInterests(e.target.value)} placeholder='interests'/>
  <input value={locations} onChange={e=>setLocations(e.target.value)} placeholder='locations comma separated'/>
  <input value={gradYear} onChange={e=>setGradYear(e.target.value)} placeholder='grad year'/>
  <button onClick={()=>api('/me/profile',{method:'PUT',body:JSON.stringify({skills:skills.split(',').map(s=>s.trim()).filter(Boolean),interests,locations:locations.split(',').map(s=>s.trim()).filter(Boolean),grad_year:gradYear?Number(gradYear):null})})}>Save</button></div>
}
