import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { BRANDS } from '../data/brands';

export default function Home() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loginGoogle() { await supabase.auth.signInWithOAuth({ provider: 'google' }); }
  async function logout() { await supabase.auth.signOut(); }

  function BrandCard({ brand }) {
    const initials = brand.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
    return (
      <a className="card" href={`/marcas/${brand.slug}`}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div className="logoBadge" style={{background: brand.logoColor}} aria-label={`Logo de ${brand.name}`} title={brand.name}>
            {initials}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{brand.name}</div>
        </div>
      </a>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1>CABURE — Marcas</h1>
        <nav className="nav">
          <a href="/cart">🛒 Carrito</a>
          <a href="/chats">💬 Mis chats</a>
          {!session ? (
            <button className="btn btn-primary" onClick={loginGoogle}>Entrar con Google</button>
          ) : (
            <>
              <span className="badge">Hola, {session.user.email}</span>
              <button className="btn" onClick={logout}>Salir</button>
            </>
          )}
        </nav>
      </header>

      <p className="muted">Seleccioná una marca para ver su catálogo por categorías.</p>

      <section className="grid">
        {BRANDS.map((b) => <BrandCard key={b.id} brand={b} />)}
      </section>
    </main>
  );
}
