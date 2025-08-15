
import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';

const SUBCATS = ['todos','remera','pantalon','buzo','campera','otros'];

export default function BrandPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [brand, setBrand] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [filter, setFilter] = React.useState('todos');
  const [canEdit, setCanEdit] = React.useState(false);
  const [desc, setDesc] = React.useState("");

  React.useEffect(()=>{
    if(!slug) return;
    (async ()=>{
      const { data: b } = await supabase.from('brands').select('*').eq('slug', slug).maybeSingle();
      setBrand(b); setDesc(b?.description || "");
      const { data: { session } } = await supabase.auth.getSession();
      if(session){
        const uid = session.user.id;
        const { data: prof } = await supabase.from('profiles').select('role').eq('user_id', uid).maybeSingle();
        if(prof?.role === 'admin') setCanEdit(true);
        else {
          const { data: rel } = await supabase.from('brand_users').select('brand_id').eq('brand_id', b?.id).eq('user_id', uid);
          setCanEdit(!!rel && rel.length>0);
        }
      }
      const { data: p } = await supabase.from('products').select('id,name,subcat,price,stock,image_url,active').eq('active', true).eq('brand_slug', slug).order('name');
      setProducts(p||[]);
    })();
  },[slug]);

  async function saveDescription(){
    if(!brand) return;
    const { error } = await supabase.from('brands').update({ description: desc }).eq('id', brand.id);
    if(!error) alert('Descripción guardada'); else alert('Error: '+error.message);
  }

  return (<main className="container">
    <a href="/">← Volver</a>
    {brand ? (<>
      <header className="header" style={{position:'relative', background:'transparent', borderBottom:'none'}}>
        <div className="header-inner container" style={{paddingLeft:0, paddingRight:0}}>
          <div className="logoBadge" style={{background: brand.color || '#7c3aed'}}>
            {brand.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <h1 style={{margin:0}}>{brand.name}</h1>
          <a href="/cart" className="btn" style={{ marginLeft: 'auto' }}>🛒 Ver carrito</a>
        </div>
      </header>

      <section className="card" style={{marginTop:12}}>
        <h2 style={{marginTop:0}}>Descripción</h2>
        {!canEdit ? (<p className="muted">{desc || "Sin descripción."}</p>) : (
          <div className="row">
            <textarea className="textarea" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Escribí la descripción de la marca..." />
            <button className="btn btn-primary" onClick={saveDescription}>Guardar</button>
          </div>
        )}
      </section>

      <section style={{marginTop:16}}>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
          {SUBCATS.map(sc => (
            <button key={sc} className={"btn"+(sc===filter?" btn-primary":"")} onClick={()=> setFilter(sc)}>
              {sc==='todos' ? 'Todas' : sc.charAt(0).toUpperCase()+sc.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid" style={{marginTop:12}}>
          {products.filter(p => filter==='todos' or p.subcat === filter).map(p => (
            <div key={p.id} className="card">
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div className="muted" style={{ marginTop: 4 }}>{p.subcat}</div>
              <div className="muted" style={{ marginTop: 4 }}>${Number(p.price||0).toLocaleString("es-AR")}</div>
            </div>
          ))}
          {products.length===0 && <div className="muted">No hay productos publicados para esta marca.</div>}
        </div>
      </section>
    </>) : <p className="muted">Cargando…</p>}
  </main>);
}
