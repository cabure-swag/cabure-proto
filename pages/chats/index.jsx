
import React from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ChatsList(){
  const [session,setSession]=React.useState(null);
  const [chats,setChats]=React.useState([]);

  React.useEffect(()=>{
    (async()=>{
      const { data:{session} } = await supabase.auth.getSession();
      setSession(session||null);
      if(!session) return;
      const { data: mine } = await supabase.from('chats').select('*').eq('customer_id', session.user.id).order('created_at',{ascending:false});
      const { data: vendorBrands } = await supabase.from('brand_users').select('brand_id').eq('user_id', session.user.id);
      const brandIds = (vendorBrands||[]).map(b=>b.brand_id);
      const { data: vendorChats } = brandIds.length? await supabase.from('chats').select('*').in('brand_id', brandIds).order('created_at',{ascending:false}) : {data:[]};
      const m = new Map(); [...(mine||[]),...(vendorChats||[])].forEach(c=>m.set(c.id,c));
      setChats(Array.from(m.values()).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)));
    })();
  },[]);

  if(!session) return <main className="container"><p className="muted">Iniciá sesión.</p></main>;

  return (<main className="container">
    <a href="/">← Volver</a>
    <h1 style={{marginTop:12}}>Mis chats</h1>
    {chats.length===0 ? <p className="muted">No tenés chats aún.</p> : (
      <ul className="list">{chats.map(c=>(<li key={c.id} className="card">
        <div><b>{c.type}</b> — {new Date(c.created_at).toLocaleString('es-AR')} — {c.status}</div>
        <div style={{marginTop:6}}><a href={`/chat/${c.id}`}>Abrir chat</a></div>
      </li>))}</ul>
    )}
  </main>);
}
