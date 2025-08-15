
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ChatDB({chatId}){
  const [messages,setMessages]=React.useState([]);
  const [input,setInput]=React.useState('');
  const [meta,setMeta]=React.useState(null);
  const [toast,setToast]=React.useState('');

  React.useEffect(()=>{
    (async()=>{
      const { data: chat } = await supabase.from('chats').select('*').eq('id',chatId).maybeSingle();
      setMeta(chat);
      const { data: msgs } = await supabase.from('chat_messages').select('*').eq('chat_id',chatId).order('created_at',{ascending:true});
      setMessages(msgs||[]);
      const ch = supabase.channel('room-'+chatId);
      ch.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` }, (payload)=>{
        setMessages(prev=>[...prev, payload.new]);
      });
      ch.subscribe();
      return ()=>{ supabase.removeChannel(ch); };
    })();
  },[chatId]);

  const send = async ()=>{
    const t=input.trim(); if(!t) return;
    try{
      const { data:{session} } = await supabase.auth.getSession();
      if(!session){ setToast('Iniciá sesión para chatear.'); return; }
      const { error } = await supabase.from('chat_messages').insert({
        chat_id: chatId, sender_id: session.user.id, sender_role: 'cliente', content: t
      });
      if(error) throw error;
      setInput('');
    }catch(e){ console.error(e); alert('No se pudo enviar: '+(e?.message||e)); }
  };

  return (<div className="card">
    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
      <strong>Chat</strong>
      {meta?.status==='closed' && <span className="muted">· Cerrado</span>}
    </div>
    <div style={{height:300,overflowY:'auto',padding:8,background:'#0f1117',border:'1px solid var(--border)',borderRadius:8}}>
      {messages.map(m=>(
        <div key={m.id} style={{marginBottom:8}}>
          <div className="muted" style={{fontSize:12}}>{m.sender_role||'usuario'} — {new Date(m.created_at).toLocaleString('es-AR')}</div>
          <div>{m.content}</div>
        </div>
      ))}
    </div>
    {meta?.status!=='closed' ? (
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <input className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribí tu mensaje..." />
        <button className="btn btn-primary" onClick={send}>Enviar</button>
      </div>
    ) : <div className="muted" style={{marginTop:8}}>El chat está cerrado.</div>}
    {toast && <div className="toast">{toast}</div>}
  </div>);
}
