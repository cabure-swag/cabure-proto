
import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import ChatDB from '../../components/ChatDB';

export default function Support(){
  const [chatId,setChatId]=React.useState(null);
  React.useEffect(()=>{(async()=>{
    const { data:{session} } = await supabase.auth.getSession();
    if(!session){ alert('Iniciá sesión con Google para abrir soporte.'); return; }
    const uid=session.user.id;
    const { data: c1 } = await supabase.from('chats').select('id').eq('type','support').eq('customer_id',uid).eq('status','open').maybeSingle();
    if(c1?.id){ setChatId(c1.id); return; }
    const { data: c2 } = await supabase.from('chats').insert({ type:'support', customer_id:uid, status:'open' }).select('id').single();
    setChatId(c2.id);
    await supabase.from('chat_messages').insert({ chat_id:c2.id, sender_id:uid, sender_role:'cliente', content:'Hola soporte, necesito ayuda.' });
  })()},[]);
  return (<main className="container">
    <a href="/">← Volver</a>
    <h1 style={{marginTop:12}}>Soporte</h1>
    {!chatId ? <p className="muted">Abriendo chat…</p> : <ChatDB chatId={chatId}/>}
  </main>);
}
