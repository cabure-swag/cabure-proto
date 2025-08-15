
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [brands, setBrands] = React.useState([]);
  React.useEffect(()=>{
    (async ()=>{
      const { data, error } = await supabase.from('brands').select('id,name,slug,color,description,active').eq('active', true).order('name');
      if(!error && data && data.length) setBrands(data);
      else setBrands([
        { id:'m1', name:'Marca 1', slug:'marca-1', color:'#1e90ff', description:'Descripción de Marca 1' },
        { id:'m2', name:'Marca 2', slug:'marca-2', color:'#ff6b6b', description:'Descripción de Marca 2' },
        { id:'m3', name:'Marca 3', slug:'marca-3', color:'#28a745', description:'Descripción de Marca 3' },
        { id:'m4', name:'Marca 4', slug:'marca-4', color:'#f4a261', description:'Descripción de Marca 4' },
      ]);
    })();
  },[]);
  function BrandCard({ brand }) {
    const initials = brand.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();
    const color = brand.color || '#7c3aed';
    return (<a className="card" href={`/marcas/${brand.slug}`}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div className="logoBadge" style={{background: color}}>{initials}</div>
        <div><div style={{ fontSize: 18, fontWeight: 600 }}>{brand.name}</div>
          {brand.description && <div className="muted" style={{fontSize:12, marginTop:4}}>{brand.description}</div>}
        </div>
      </div>
    </a>);
  }
  return (<main className="container">
    <p className="muted">Seleccioná una marca para ver su catálogo por categorías.</p>
    <section className="grid">{brands.map(b=> <BrandCard key={b.id} brand={b} />)}</section>
  </main>);
}
