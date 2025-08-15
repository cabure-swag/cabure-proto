
import React from 'react';
import { supabase } from '../lib/supabaseClient';
export default function DashboardRedirect(){
  React.useEffect(()=>{(async()=>{
    const { data:{session} } = await supabase.auth.getSession();
    if(!session){ window.location.href='/'; return; }
    const { data: prof } = await supabase.from('profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    const role=prof?.role||'cliente';
    if(role==='admin') window.location.href='/admin';
    else if(role==='vendedor') window.location.href='/vendor';
    else window.location.href='/';
  })()},[]);
  return <main className="container"><p className="muted">Redirigiendo a tu panel…</p></main>;
}
