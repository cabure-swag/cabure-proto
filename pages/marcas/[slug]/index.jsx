
import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';
import { useCart } from '../../../components/CartContext';

const SUBCATS=['todos','remera','pantalon','buzo','campera','otros'];

export default function BrandPage(){
  const router=useRouter(); const { slug }=router.query; const { addItem }=useCart();
  const [brand,setBrand]=React.useState(null); const [products,setProducts]=React.useState([]);
  const [filter,setFilter]=React.useState('todos'); const [canEdit,setCanEdit]=React.useState(false); const [desc,setDesc]=React.useState('');
  const [logoUrl,setLogoUrl]=React.useState(''); const [bank,setBank]=React.useState({alias:'',cbu:''}); const [mpToken,setMpToken]=React.useState('');

  React.useEffect(()=>{ if(!slug) return; (async()=>{
    const { data: b } = await supabase.from('brands').select('*').eq('slug',slug).maybeSingle();
    setBrand(b); setDesc(b?.description||''); setLogoUrl(b?.logo_url||''); setBank({alias:b?.bank_alias||'', cbu:b?.bank_cbu||''}); setMpToken(b?.mp_access_token||'');
    const { data:{session} } = await supabase.auth.getSession();
    if(session && b){
      const uid=session.user.id;
      const { data: prof } = await supabase.from('profiles').select('role').eq('user_id',uid).maybeSingle();
      if(prof?.role==='admin') setCanEdit(true);
      else{ const { data: rel } = await supabase.from('brand_users').select('brand_id').eq('brand_id',b.id).eq('user_id',uid); setCanEdit(!!rel && rel.length>0); }
    }
    const { data: p } = await supabase.from('products').select('id,name,subcat,price,stock,image_url,active,brand_id,brand_slug').eq('active',true).eq('brand_slug',slug).order('name');
    setProducts(p||[]);
  })() },[slug]);

  async function saveBrand(){
    if(!brand) return;
    const payload={description:desc, logo_url:logoUrl, bank_alias:bank.alias||null, bank_cbu:bank.cbu||null, mp_access_token:mpToken||null};
    const { error } = await supabase.from('brands').update(payload).eq('id',brand.id);
    if(error) alert('Error: '+error.message); else alert('Datos de la marca guardados');
  }
  function onAddToCart(p){ addItem({id:p.id,name:p.name,price:Number(p.price||0),brand_id:p.brand_id||brand?.id||null,brand:p.brand_slug||slug},1); }

  return (<main className="container">
    <a href="/">← Volver</a>
    {brand ? (<>
      <header className="header" style={{position:'relative',background:'transparent',borderBottom:'none'}}>
        <div className="header-inner container" style={{paddingLeft:0,paddingRight:0}}>
          <div className="logoBadge" style={{background:brand.color||'#7c3aed'}}>{brand.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}</div>
          <h1 style={{margin:0}}>{brand.name}</h1>
          <a href="/cart" className="btn" style={{marginLeft:'auto'}}>🛒 Ver carrito</a>
        </div>
      </header>

      <section className="card" style={{marginTop:12}}>
        <h2 style={{marginTop:0}}>Descripción y Medios de pago</h2>
        {!canEdit ? (
          <>
            <p className="muted">{desc || 'Sin descripción.'}</p>
            {(bank.alias || bank.cbu) && <p className="muted">Transferencia: {bank.alias || bank.cbu}</p>}
          </>
        ) : (
          <div className="row">
            <label>Descripción</label>
            <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Escribí la descripción de la marca..."/>
            <label>URL del logo (opcional)</label>
            <input className="input" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://.../mi-logo.png"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="row"><label>Alias</label><input className="input" value={bank.alias} onChange={e=>setBank({...bank,alias:e.target.value})} /></div>
              <div className="row"><label>CBU</label><input className="input" value={bank.cbu} onChange={e=>setBank({...bank,cbu:e.target.value})} /></div>
            </div>
            <label>Mercado Pago Access Token (se guarda por marca)</label>
            <input className="input" type="password" value={mpToken} onChange={e=>setMpToken(e.target.value)} placeholder="APP_USR-..." />
            <button className="btn btn-primary" onClick={saveBrand}>Guardar</button>
          </div>
        )}
      </section>

      <section style={{marginTop:16}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          {SUBCATS.map(sc=>(<button key={sc} className={'btn'+(sc===filter?' btn-primary':'')} onClick={()=>setFilter(sc)}>{sc==='todos'?'Todas':sc.charAt(0).toUpperCase()+sc.slice(1)}</button>))}
        </div>
        <div className="grid" style={{marginTop:12}}>
          {products.filter(p=>filter==='todos'?true:p.subcat===filter).map(p=>(
            <div key={p.id} className="card">
              <div style={{fontWeight:600}}>{p.name}</div>
              <div className="muted" style={{marginTop:4}}>{p.subcat}</div>
              <div className="muted" style={{marginTop:4}}>${Number(p.price||0).toLocaleString('es-AR')}</div>
              <div style={{marginTop:8}}><button className="btn btn-primary" onClick={()=>onAddToCart(p)}>Agregar al carrito</button></div>
            </div>
          ))}
          {products.length===0 && <div className="muted">No hay productos publicados para esta marca.</div>}
        </div>
      </section>
    </>) : <p className="muted">Cargando…</p>}
  </main>);
}
