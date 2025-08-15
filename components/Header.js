
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Header(){
  const [session,setSession]=React.useState(null);
  const [role,setRole]=React.useState('cliente');

  React.useEffect(()=>{
    let sub;
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
      if (data.session) {
        const uid = data.session.user.id;
        const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', uid).maybeSingle();
        setRole(prof?.role || 'cliente');
      }
    })();
    const r = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s || null);
      if (s) {
        const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', s.user.id).maybeSingle();
        setRole(prof?.role || 'cliente');
      } else {
        setRole('cliente');
      }
    });
    sub = r.data?.subscription;
    return ()=> sub && sub.unsubscribe();
  },[]);

  const goDashboard=()=>{
    if(role==='admin') window.location.href='/admin';
    else if(role==='vendedor') window.location.href='/vendor';
  };

  return (
    <div className="header">
      <div className="header-inner container" style={{paddingLeft:0,paddingRight:0}}>
        <a href="/" className="brand-title" style={{color:'#fff', textDecoration:'none'}}>CABURE.STORE</a>
        <nav className="nav" style={{marginLeft:'auto'}}>
          <a href="/support">🆘 Soporte</a>
          <a href="/cart">🛒 Carrito</a>
          <a href="/chats">💬 Mis chats</a>
          {(role==='admin' || role==='vendedor') && <button className="btn" onClick={goDashboard}>Dashboard</button>}
          {!session ? (
            <button className="btn btn-primary" onClick={()=>supabase.auth.signInWithOAuth({provider:'google'})}>Entrar con Google</button>
          ) : (
            <>
              <span className="badge">Hola, {session.user.email}</span>
              <button className="btn" onClick={()=>supabase.auth.signOut()}>Salir</button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
