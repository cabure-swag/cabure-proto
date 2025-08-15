
import React from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Admin(){
  const [role,setRole]=React.useState('');
  const [brands,setBrands]=React.useState([]);
  const [form,setForm]=React.useState({name:'',slug:'',color:'#7c3aed',active:true,bank_alias:'',bank_cbu:'',mp_access_token:'',logo_url:''});
  const [assign,setAssign]=React.useState({brand_id:'',email:''});

  React.useEffect(()=>{(async()=>{
    const { data:{session} }=await supabase.auth.getSession();
    if(!session){ alert('Iniciá sesión'); return; }
    const { data: prof } = await supabase.from('profiles').select('role').eq('user_id',session.user.id).maybeSingle();
    setRole(prof?.role||'');
    await loadBrands();
  })()},[]);

  async function loadBrands(){ const { data } = await supabase.from('brands').select('*').order('name'); setBrands(data||[]); }
  const onChange=e=> setForm(f=>({...f,[e.target.name]: e.target.name==='active'? e.target.checked : e.target.value }));
  const onAssign=e=> setAssign(a=>({...a,[e.target.name]: e.target.value }));

  async function createBrand(){
    const payload={ name:form.name, slug:form.slug, color:form.color, active:form.active, bank_alias:form.bank_alias||null, bank_cbu:form.bank_cbu||null, mp_access_token:form.mp_access_token||null, logo_url:form.logo_url||null };
    const { error } = await supabase.from('brands').insert(payload);
    if(error) alert(error.message); else { setForm({name:'',slug:'',color:'#7c3aed',active:true,bank_alias:'',bank_cbu:'',mp_access_token:'',logo_url:''}); await loadBrands(); }
  }
  async function delBrand(b){ if(!confirm('¿Eliminar esta marca?')) return; const { error } = await supabase.from('brands').delete().eq('id',b.id); if(!error) await loadBrands(); }
  async function assignVendor(){
    if(!assign.brand_id || !assign.email) return;
    const { data: prof } = await supabase.from('profiles').select('user_id').eq('email',assign.email).maybeSingle();
    if(!prof){ alert('Ese email no tiene perfil (debe loguearse una vez).'); return; }
    await supabase.from('brand_users').insert({ brand_id:assign.brand_id, user_id:prof.user_id });
    setAssign({brand_id:'',email:''}); alert('Vinculado.');
  }

  if(role!=='admin') return <main className="container"><h1>Admin</h1><p className="muted">Necesitás rol de admin.</p></main>;

  return (<main className="container">
    <h1>Admin — Marcas y Vendedores</h1>

    <section className="card">
      <h2 style={{marginTop:0}}>Crear marca</h2>
      <div className="row" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <div className="row"><label>Nombre</label><input className="input" name="name" value={form.name} onChange={onChange}/></div>
        <div className="row"><label>Slug</label><input className="input" name="slug" value={form.slug} onChange={onChange} placeholder="marca-1"/></div>
        <div className="row"><label>Color</label><input className="input" name="color" value={form.color} onChange={onChange}/></div>
        <div className="row" style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" name="active" checked={form.active} onChange={onChange}/><label>Activa</label></div>
        <div className="row"><label>Logo URL</label><input className="input" name="logo_url" value={form.logo_url} onChange={onChange} placeholder="https://.../logo.png"/></div>
        <div className="row"><label>Alias/CBU</label><input className="input" name="bank_alias" value={form.bank_alias} onChange={onChange} placeholder="ALIAS o CBU"/></div>
        <div className="row"><label>Mercado Pago Access Token</label><input className="input" name="mp_access_token" value={form.mp_access_token} onChange={onChange} placeholder="APP_USR-..."/></div>
      </div>
      <div style={{marginTop:8}}><button className="btn btn-primary" onClick={createBrand}>Crear marca</button></div>
    </section>

    <section className="card" style={{marginTop:12}}>
      <h2 style={{marginTop:0}}>Marcas</h2>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Slug</th><th>Activa</th><th>Alias/CBU</th><th>MP Token</th><th></th></tr></thead>
        <tbody>{brands.map(b=>(<tr key={b.id}>
          <td>{b.name}</td><td>{b.slug}</td><td>{b.active?'Sí':'No'}</td><td>{b.bank_alias||b.bank_cbu||'-'}</td><td>{b.mp_access_token?'●●●●':'-'}</td>
          <td><button className="btn btn-danger" onClick={()=>delBrand(b)}>Eliminar</button></td>
        </tr>))}</tbody>
      </table>
    </section>

    <section className="card" style={{marginTop:12}}>
      <h2 style={{marginTop:0}}>Asignar vendedor a marca</h2>
      <div className="row" style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:12}}>
        <div className="row"><label>Marca</label>
          <select className="input" name="brand_id" value={assign.brand_id} onChange={onAssign}>
            <option value="">Elegí</option>
            {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="row"><label>Email del vendedor</label><input className="input" name="email" value={assign.email} onChange={onAssign} placeholder="vendedor@correo.com"/></div>
        <div style={{alignSelf:'end'}}><button className="btn btn-primary" onClick={assignVendor}>Asignar</button></div>
      </div>
      <p className="muted" style={{marginTop:8}}>El vendedor debe haber iniciado sesión al menos una vez para que exista su perfil.</p>
      <div style={{marginTop:12}}><a className="btn" href="/admin/support">Ver chats de soporte</a></div>
    </section>
  </main>);
}
