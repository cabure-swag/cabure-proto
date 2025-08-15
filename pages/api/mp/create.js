
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const { orderId, brandSlug, items } = req.body || {};
    if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({error:'No items'});
    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if(!ACCESS_TOKEN) return res.status(200).json({ ok:true, init_point:null, note:'Falta MERCADOPAGO_ACCESS_TOKEN' });
    const preference = {
      items: items.map((it)=>({ title: it.name, quantity: it.qty||1, unit_price: Number(it.price||0), currency_id: 'ARS' })),
      external_reference: orderId,
      back_urls: {
        success: process.env.APP_URL || 'http://localhost:3000',
        failure: process.env.APP_URL || 'http://localhost:3000',
        pending: process.env.APP_URL || 'http://localhost:3000'
      },
      auto_return: 'approved'
    };
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method:'POST',
      headers:{ 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type':'application/json' },
      body: JSON.stringify(preference)
    });
    const data = await r.json();
    if(data.init_point) return res.status(200).json({ ok:true, init_point: data.init_point });
    return res.status(200).json({ ok:false, init_point:null, data });
  }catch(e){
    console.error(e);
    return res.status(500).json({error: e?.message || 'mp_error'});
  }
}
