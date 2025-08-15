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

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }
  async function logout() {
    await supabase.auth.signOut();
  }

  function BrandCard({ brand }) {
    const size = 72;
    const initials = brand.name
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <a
        href={`/marcas/${brand.slug}`}
        style={{
          display: 'block',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: 16,
          textDecoration: 'none',
          color: '#111827',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              background: brand.logoColor,
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 20
            }}
            aria-label={`Logo de ${brand.name}`}
            title={brand.name}
          >
            {initials}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{brand.name}</div>
        </div>
      </a>
    );
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial', maxWidth: 980, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, flex: '0 0 auto' }}>CABURE — Marcas</h1>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <a href="/cart" style={{ textDecoration: 'none' }}>🛒 Carrito</a>
          <a href="/chats" style={{ textDecoration: 'none' }}>💬 Mis chats</a>

          {!session ? (
            <button onClick={loginGoogle}>Entrar con Google</button>
          ) : (
            <>
              <span style={{ color: '#374151' }}>Hola, {session.user.email}</span>
              <button onClick={logout}>Salir</button>
            </>
          )}
        </nav>
      </header>

      <p style={{ color: '#4b5563', marginTop: 0 }}>
        Seleccioná una marca para ver su catálogo por categorías.
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        {BRANDS.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </section>
    </main>
  );
}
