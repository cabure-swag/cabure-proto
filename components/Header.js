
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const [session, setSession] = React.useState(null);
  React.useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=> setSession(s));
    return ()=> sub.subscription.unsubscribe();
  },[]);
  async function loginGoogle(){ await supabase.auth.signInWithOAuth({ provider:'google' }); }
  async function logout(){ await supabase.auth.signOut(); }
  return (
    <div className="header">
      <div className="header-inner container" style={{paddingLeft:0, paddingRight:0}}>
        <a href="/" className="brand-title" style={{ fontSize: 18, color:'#fff', textDecoration:'none' }}>CABURE.STORE</a>
        <nav className="nav">
          <a href="/cart">🛒 Carrito</a>
          <a href="/chats">💬 Mis chats</a>
          <a href="/vendor">👔 Vendedor</a>
          <a href="/admin">🛠️ Admin</a>
          {!session ? (<button className="btn btn-primary" onClick={loginGoogle}>Entrar con Google</button>) : (<><span className="badge">Hola, {session.user.email}</span><button className="btn" onClick={logout}>Salir</button></>)}
        </nav>
      </div>
    </div>
  );
}
