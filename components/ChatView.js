
import React from 'react';
export default function ChatView({chatId}){
  const [chat,setChat]=React.useState(null);
  const [input,setInput]=React.useState('');
  React.useEffect(()=>{const raw=localStorage.getItem('cabure_chats'); const all=raw?JSON.parse(raw):[]; setChat(all.find(x=>x.id===chatId)||null);},[chatId]);
  const persist=(fn)=>{const raw=localStorage.getItem('cabure_chats'); const all=raw?JSON.parse(raw):[]; const i=all.findIndex(x=>x.id===chatId); if(i===-1) return; const up=fn(all[i]); all[i]=up; localStorage.setItem('cabure_chats', JSON.stringify(all)); setChat(up);};
  const send=()=>{const t=input.trim(); if(!t) return; persist(c=>({...c,messages:[...c.messages,{from:'Cliente',text:t,at:new Date().toISOString()}]})); setInput('');};
  const close=()=>persist(c=>({...c,closed:true}));
  if(!chat) return <div className="muted">Chat no encontrado.</div>;
  const expired=new Date(chat.expiresAt).getTime()<Date.now();
  return (<div className="card">
    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}><strong>Chat del pedido {chat.orderId}</strong>{chat.closed&&<span className="muted">· Cerrado</span>}{expired&&<span style={{color:'#ef4444'}}>· Expirado (3 meses)</span>}</div>
    <div style={{height:260,overflowY:'auto',padding:8,background:'#0f1117',border:'1px solid var(--border)',borderRadius:8}}>
      {chat.messages.map((m,i)=>(<div key={i} style={{marginBottom:8}}><div className="muted" style={{fontSize:12}}>{m.from} — {new Date(m.at).toLocaleString('es-AR')}</div><div>{m.text}</div></div>))}
    </div>
    {(!chat.closed && !expired)?(<div style={{display:'flex',gap:8,marginTop:8}}><input className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Mensaje..."/><button className="btn btn-primary" onClick={send}>Enviar</button><button className="btn" onClick={close}>Finalizar</button></div>):(<div className="muted" style={{marginTop:8}}>El chat no admite nuevos mensajes.</div>)}
  </div>);
}
