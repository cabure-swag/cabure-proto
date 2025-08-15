
import React from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../components/CartContext';
import { supabase } from '../lib/supabaseClient';

export default function CheckoutPage(){
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form,setForm]=React.useState({ nombre:'', dni:'', email:'', telefono:'', domicilio:'', provincia:'', localidad:'', codigoPostal:'', entreCalles:'', observaciones:'' });
  const [pay,setPay]=React.useState('mp'); // 'mp' | 'transfer'
  const onChange=e=> setForm(f=>({...f,[e.target.name]:e.target.value}));
  const disabled = items.length===0;

  async function saveOrder(orderId, uid){
    const { error: e1 } = await supabase.from('orders').insert({ id:orderId, user_id:uid||null, total });
    if(e1) throw e1;
    const rows = items.map(it=>({ order_id:orderId, product_id:it.id||null, brand_id:it.brand_id||null, brand_slug:it.brand||null, name:it.name, price:it.price, qty:it.qty }));
    const { error: e2 } = await supabase.from('order_items').insert(rows); if(e2) throw e2;
    const { error: e3 } = await supabase.from('shipping_addresses').insert({
      order_id:orderId, nombre:form.nombre, dni:form.dni, email:form.email, telefono:form.telefono,
      domicilio:form.domicilio, provincia:form.provincia, localidad:form.localidad, codigo_postal:form.codigoPostal,
      entre_calles:form.entreCalles, observaciones:form.observaciones
    }); if(e3) throw e3;
  }

  async function createOrderChats(orderId, uid){
    const brands = Array.from(new Set(items.map(i=>i.brand||'desconocida')));
    const createdIds=[];
    for(const brand of brands){
      const { data: br } = await supabase.from('brands').select('id').eq('slug', brand).maybeSingle();
      const payload = { type:'order', order_id:orderId, brand_id: br?.id || null, customer_id: uid||null, status:'open' };
      const { data, error } = await supabase.from('chats').insert(payload).select('id').single();
      if(!error && data?.id){
        await supabase.from('chat_messages').insert({ chat_id:data.id, sender_id: uid||null, sender_role:'sistema', content:'¡Compra confirmada! Este chat conecta al cliente con la marca para coordinar la entrega.' });
        createdIds.push(data.id);
      }
    }
    return createdIds;
  }

  async function onSubmit(e){
    e.preventDefault(); if(disabled) return;
    if(!form.nombre || !form.email || !form.domicilio || !form.codigoPostal){ alert('Completá Nombre, Email, Domicilio y Código Postal'); return; }
    const orderId='ORD-'+Math.random().toString(36).slice(2,10).toUpperCase();
    const { data:{session} } = await supabase.auth.getSession();
    const uid=session?.user?.id||null;
    try{ await saveOrder(orderId, uid); }catch(err){ console.error(err); alert('No se pudo guardar el pedido.'); return; }
    let chatIds=[];
    try{ if(uid) chatIds = await createOrderChats(orderId, uid); }catch(e){ console.error('chat fail', e); }

    if(pay==='mp'){
      const brands = Array.from(new Set(items.map(i=>i.brand||'desconocida')));
      const brand = brands.length===1 ? brands[0] : null;
      const res = await fetch('/api/mp/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId, brandSlug: brand, items }) });
      const data = await res.json();
      if(data?.init_point){
        clearCart();
        window.location.href = data.init_point;
        return;
      } else {
        alert('Mercado Pago no está configurado (brand/global). Pasá a Transferencia o Soporte.');
      }
    }

    clearCart();
    if(chatIds.length===1) router.replace(`/chat/${chatIds[0]}`);
    else router.replace('/chats');
  }

  return (<main className="container">
    <a href="/cart">← Volver al carrito</a>
    <h1 style={{marginTop:12}}>Checkout — Datos de envío</h1>
    {disabled ? <p className="muted">No hay productos en el carrito.</p> : (
      <form onSubmit={onSubmit} className="row" style={{maxWidth:680}}>
        <div className="row"><label>Nombre completo *</label><input className="input" name="nombre" value={form.nombre} onChange={onChange} required/></div>
        <div className="row"><label>DNI</label><input className="input" name="dni" value={form.dni} onChange={onChange}/></div>
        <div className="row"><label>Email *</label><input className="input" type="email" name="email" value={form.email} onChange={onChange} required/></div>
        <div className="row"><label>Teléfono</label><input className="input" name="telefono" value={form.telefono} onChange={onChange}/></div>
        <div className="row"><label>Domicilio *</label><input className="input" name="domicilio" value={form.domicilio} onChange={onChange} required/></div>
        <div className="row"><label>Provincia</label><input className="input" name="provincia" value={form.provincia} onChange={onChange}/></div>
        <div className="row"><label>Localidad</label><input className="input" name="localidad" value={form.localidad} onChange={onChange}/></div>
        <div className="row"><label>Código Postal *</label><input className="input" name="codigoPostal" value={form.codigoPostal} onChange={onChange} required/></div>
        <div className="row"><label>Entre calles</label><input className="input" name="entreCalles" value={form.entreCalles} onChange={onChange}/></div>
        <div className="row"><label>Observaciones</label><textarea className="textarea" name="observaciones" value={form.observaciones} onChange={onChange}/></div>

        <div className="card">
          <h3 style={{marginTop:0}}>Método de pago</h3>
          <label><input type="radio" name="pay" checked={pay==='mp'} onChange={()=>setPay('mp')}/> Mercado Pago (tarjeta/QR)</label>
          <label><input type="radio" name="pay" checked={pay==='transfer'} onChange={()=>setPay('transfer')}/> Transferencia/QR (coordinar por chat)</label>
        </div>

        <div><button className="btn btn-primary" type="submit">Confirmar compra</button></div>
      </form>
    )}
  </main>);
}
