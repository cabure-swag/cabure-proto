
import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import ChatDB from '../../components/ChatDB';

export default function ChatPage(){
  const { query:{id} }=useRouter();
  const [session,setSession]=React.useState(null);
  React.useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));},[]);
  if(!id) return null;
  if(!session) return <main className='container'><p className='muted'>Iniciá sesión.</p></main>;
  return (<main className='container'>
    <a href='/'>← Volver a la tienda</a>
    <h1 style={{marginTop:12}}>Chat</h1>
    <ChatDB chatId={id}/>
  </main>);
}
