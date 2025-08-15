
import React from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

function monthKey(d){ const dt=new Date(d); return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0'); }

export default function VendorAnalytics(){
  const router=useRouter();
  const brandId = router.query.brand || null;
  const [allowed,setAllowed]=React.useState(false);
  const [rows,setRows]=React.useState([]);

  React.useEffect(()=>{(async()=>{
    const { data:{session} }=await supabase.auth.getSession();
    if(!session || !brandId) return;
    const { data: rel } = await supabase.from('brand_users').select('brand_id').eq('brand_id',brandId).eq('user_id',session.user.id);
    setAllowed((rel||[]).length>0);
    if((rel||[]).length===0) return;

    const { data } = await supabase.from('order_items').select('price,qty,brand_id,order_id,orders(created_at),name').eq('brand_id',brandId);
    setRows(data||[]);
  })()},[brandId]);

  if(!brandId) return <main className="container"><p className="muted">Elegí una marca desde /vendor.</p></main>;
  if(!allowed) return <main className="container"><p className="muted">No tenés acceso a esta marca.</p></main>;

  const totals = rows.reduce((acc,r)=>{
    const mk = monthKey(r.orders?.created_at || new Date());
    if(!acc.byMonth[mk]) acc.byMonth[mk]={revenue:0,orders:new Set(),qty:0};
    const line = Number(r.price||0)*Number(r.qty||0);
    acc.byMonth[mk].revenue += line;
    acc.byMonth[mk].qty += Number(r.qty||0);
    acc.byMonth[mk].orders.add(r.order_id);
    acc.revenue += line;
    acc.qty += Number(r.qty||0);
    acc.orders.add(r.order_id);
    const k = r.name || 'Producto';
    acc.byProduct[k]=(acc.byProduct[k]||0)+line;
    return acc;
  }, {revenue:0, qty:0, orders:new Set(), byMonth:{}, byProduct:{} });

  const months = Object.entries(totals.byMonth).sort((a,b)=>a[0].localeCompare(b[0]));
  const ticket = totals.orders.size ? totals.revenue / totals.orders.size : 0;
  const top = Object.entries(totals.byProduct).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (<main className="container">
    <a href="/vendor">← Volver</a>
    <h1 style={{marginTop:12}}>Estadísticas de ventas</h1>

    <section className="kpi">
      <div className="card"><div className="muted">Ingresos</div><div style={{fontSize:24,fontWeight:700}}>${totals.revenue.toLocaleString('es-AR')}</div></div>
      <div className="card"><div className="muted">Pedidos</div><div style={{fontSize:24,fontWeight:700}}>{totals.orders.size}</div></div>
      <div className="card"><div className="muted">Unidades</div><div style={{fontSize:24,fontWeight:700}}>{totals.qty}</div></div>
      <div className="card"><div className="muted">Ticket promedio</div><div style={{fontSize:24,fontWeight:700}}>${ticket.toFixed(0)}</div></div>
    </section>

    <section className="card" style={{marginTop:12}}>
      <h2 style={{marginTop:0}}>Ventas por mes</h2>
      <table className="table"><thead><tr><th>Mes</th><th>Pedidos</th><th>Unidades</th><th>Ingresos</th></tr></thead>
        <tbody>{months.map(([m,v])=>(<tr key={m}><td>{m}</td><td>{v.orders.size}</td><td>{v.qty}</td><td>${v.revenue.toLocaleString('es-AR')}</td></tr>))}</tbody>
      </table>
    </section>

    <section className="card" style={{marginTop:12}}>
      <h2 style={{marginTop:0}}>Top productos</h2>
      <table className="table"><thead><tr><th>Producto</th><th>Ingresos</th></tr></thead>
        <tbody>{top.map(([name,rev])=>(<tr key={name}><td>{name}</td><td>${rev.toLocaleString('es-AR')}</td></tr>))}</tbody>
      </table>
    </section>
  </main>);
}
