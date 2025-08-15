
import React from 'react';
export default function ChatLocal({chatId}){
  const [chat,setChat]=React.useState(null);
  const [input,setInput]=React.useState('');
  React.useEffect(()=>{const raw=localStorage.getItem('cabure_chats'); const all=raw?JSON.parse(raw):[]; setChat(all.find(x=>x.id===chatId)||null);},[chatId]);
  const persist=(fn)=>{const raw=localStorage.getItem('cabure_chats'); const all=raw?JSON.parse(raw):[]; const i=all.findIndex(x=>x.id===chatId); if(i===-1) return; const up=fn(all[i]); all[i]=up; localStorage.setItem('cabure_chats', JSON.stringify(all)); setChat(up);};
  const send=()=>{const t=input.trim(); if(!t) return; persist(c=>({...c,messages:[...c.messages,{from:'Cliente',text:t,at:new Date().toISOString()}]})); setInput('');};
  if(!chat) return <div className="muted">Chat no encontrado (local).</div>;
  return (<div className="card">
    <strong>Chat local</strong>
    <div style={{height:260,overflowY:'auto',padding:8,background:'#0f1117',border:'1px solid var(--border)',borderRadius:8}}>
      {chat.messages.map((m,i)=>(<div key={i} style={{marginBottom:8}}><div className="muted" style={{fontSize:12}}>{m.from} — {new Date(m.at).toLocaleString('es-AR')}</div><div>{m.text}</div></div>))}
    </div>
    <div style={{display:'flex',gap:8,marginTop:8}}>
      <input className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Mensaje..." />
      <button className="btn btn-primary" onClick={send}>Enviar</button>
    </div>
  </div>);
}
