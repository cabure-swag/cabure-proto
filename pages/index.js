
import React from 'react';
import { supabase } from '../lib/supabaseClient';
export default function Home(){
  const [brands,setBrands]=React.useState([]);
  React.useEffect(()=>{(async()=>{
    const { data, error } = await supabase.from('brands').select('id,name,slug,color,description,active,logo_url').eq('active',true).order('name');
    if(!error && data?.length) setBrands(data);
    else setBrands([{id:'m1',name:'Marca 1',slug:'marca-1',color:'#1e90ff',description:'Descripción de Marca 1'},{id:'m2',name:'Marca 2',slug:'marca-2',color:'#ff6b6b',description:'Descripción de Marca 2'},{id:'m3',name:'Marca 3',slug:'marca-3',color:'#28a745',description:'Descripción de Marca 3'},{id:'m4',name:'Marca 4',slug:'marca-4',color:'#f4a261',description:'Descripción de Marca 4'}]);
  })()},[]);
  return (<main className="container">
    <p className="muted">Seleccioná una marca para ver su catálogo.</p>
    <section className="grid">
      {brands.map(b=>(<a key={b.id} className="card" href={`/marcas/${b.slug}`}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {b.logo_url ? <img src={b.logo_url} alt={b.name} style={{width:84,height:84,borderRadius:12,objectFit:'cover',border:'1px solid rgba(255,255,255,.1)'}}/> : <div className="logoBadge" style={{background:b.color||'#7c3aed'}}>{b.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}</div>}
          <div><div style={{fontWeight:600}}>{b.name}</div>{b.description && <div className="muted" style={{fontSize:12,marginTop:4}}>{b.description}</div>}</div>
        </div>
      </a>))}
    </section>
  </main>);
}
