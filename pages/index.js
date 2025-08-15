import React from 'react';
import { supabase } from '../lib/supabaseClient';

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

  return (
    <main style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>CABURE — Demo</h1>
      <p>Prototipo funcionando para mostrar a los vendedores.</p>

      {!session ? (
        <button onClick={loginGoogle} style={{ marginTop: 12 }}>Entrar con Google</button>
      ) : (
        <>
          <div style={{ marginTop: 12 }}>Hola, {session.user.email}</div>
          <button onClick={logout} style={{ marginTop: 8 }}>Salir</button>
        </>
      )}
    </main>
  );
}
