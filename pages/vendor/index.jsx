
import React from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Vendor(){
  const [brands,setBrands]=React.useState([]);
  const [products,setProducts]=React.useState([]);
  const [selectedBrand,setSelectedBrand]=React.useState(null);
  const [form,setForm]=React.useState({name:'',subcat:'remera',price:'',stock:'',image_url:'',active:true});

  React.useEffect(()=>{(async()=>{
    const { data:{session} } = await supabase.auth.getSession();
    if(!session){ alert('Iniciá sesión'); return; }
    const uid=session.user.id;
    const { data: joins } = await supabase.from('brand_users').select('brand_id,brands(id,name,slug)').eq('user_id',uid);
    const bs=(joins||[]).map(j=>j.brands); setBrands(bs);
    if(bs[0]){ setSelectedBrand(bs[0]); await loadProducts(bs[0]); }
  })()},[]);

  async function loadProducts(brand){ const { data: ps } = await supabase.from('products').select('*').eq('brand_id',brand.id).order('name'); setProducts(ps||[]); }
  async function onSelectBrand(e){ const b=brands.find(x=>x.id===e.target.value); setSelectedBrand(b); if(b) await loadProducts(b); }
  const onChange=e=> setForm(f=>({...f,[e.target.name]: e.target.name==='active'? e.target.checked : e.target.value }));

  async function createProduct(){
    if(!selectedBrand) return;
    const payload={ brand_id:selectedBrand.id, brand_slug:selectedBrand.slug, name:form.name, subcat:form.subcat, price:Number(form.price||0), stock:Number(form.stock||0), image_url:form.image_url||null, active:form.active };
    const { error } = await supabase.from('products').insert(payload);
    if(error) alert('Error: '+error.message); else { await loadProducts(selectedBrand); setForm({name:'',subcat:'remera',price:'',stock:'',image_url:'',active:true}); }
  }
  async function toggleActive(p){ const { error } = await supabase.from('products').update({active:!p.active}).eq('id',p.id); if(!error) await loadProducts(selectedBrand); }
  async function del(p){ if(!confirm('¿Eliminar este producto?')) return; const { error } = await supabase.from('products').delete().eq('id',p.id); if(!error) await loadProducts(selectedBrand); }

  return (<main className="container">
    <h1>Panel de Vendedor</h1>
    {brands.length===0 ? <p className="muted">No estás asignado a ninguna marca.</p> : (<>
      <div className="card"><div className="row">
        <label>Marca</label>
        <select className="input" onChange={onSelectBrand} value={selectedBrand?.id||''}>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
        {selectedBrand && <a className="btn" href={`/vendor/analytics?brand=${selectedBrand.id}`}>Ver estadísticas</a>}
      </div></div>

      <section className="card" style={{marginTop:12}}>
        <h2 style={{marginTop:0}}>Nuevo producto</h2>
        <div className="row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="row"><label>Nombre</label><input className="input" name="name" value={form.name} onChange={onChange}/></div>
          <div className="row"><label>Subcategoría</label><select className="input" name="subcat" value={form.subcat} onChange={onChange}>
            <option value="remera">Remera</option><option value="pantalon">Pantalon</option><option value="buzo">Buzo</option><option value="campera">Campera</option><option value="otros">Otros</option>
          </select></div>
          <div className="row"><label>Precio</label><input className="input" name="price" type="number" value={form.price} onChange={onChange}/></div>
          <div className="row"><label>Stock</label><input className="input" name="stock" type="number" value={form.stock} onChange={onChange}/></div>
          <div className="row" style={{gridColumn:'1/-1'}}><label>Imagen (URL)</label><input className="input" name="image_url" value={form.image_url} onChange={onChange}/></div>
          <div className="row" style={{gridColumn:'1/-1',display:'flex',alignItems:'center',gap:8}}><input type="checkbox" name="active" checked={form.active} onChange={onChange}/><label>Activo</label></div>
          <div><button className="btn btn-primary" onClick={createProduct}>Crear</button></div>
        </div>
      </section>

      <section className="card" style={{marginTop:12}}>
        <h2 style={{marginTop:0}}>Productos</h2>
        <table className="table"><thead><tr><th>Nombre</th><th>Subcat</th><th>Precio</th><th>Stock</th><th>Activo</th><th></th></tr></thead>
          <tbody>{products.map(p=>(<tr key={p.id}>
            <td>{p.name}</td><td>{p.subcat}</td><td>${Number(p.price||0).toLocaleString('es-AR')}</td><td>{p.stock}</td>
            <td><button className="btn" onClick={()=>toggleActive(p)}>{p.active?'Sí':'No'}</button></td>
            <td><button className="btn btn-danger" onClick={()=>del(p)}>Eliminar</button></td>
          </tr>))}</tbody></table>
      </section>
    </>)}
  </main>);
}
