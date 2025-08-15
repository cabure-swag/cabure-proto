
import React from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminSupport(){
  const [role,setRole]=React.useState('');
  const [chats,setChats]=React.useState([]);

  React.useEffect(()=>{(async()=>{
    const { data:{session} }=await supabase.auth.getSession();
    if(!session){ alert('Iniciá sesión'); return; }
    const { data: prof } = await supabase.from('profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    setRole(prof?.role||'');
    if(prof?.role==='admin'){
      const { data } = await supabase.from('chats').select('*').eq('type','support').order('created_at',{ascending:false});
      setChats(data||[]);
    }
  })()},[]);

  if(role!=='admin') return <main className="container"><h1>Soporte</h1><p className="muted">Solo admin.</p></main>;

  return (<main className="container">
    <h1>Chats de soporte</h1>
    <ul className="list">
      {chats.map(c=>(<li key={c.id} className="card">
        <div><b>{c.id}</b> — {new Date(c.created_at).toLocaleString('es-AR')} — Estado: {c.status}</div>
        <div style={{marginTop:6}}><a href={`/chat/${c.id}`}>Abrir chat</a></div>
      </li>))}
    </ul>
  </main>);
}
