import React from "react";
import { useRouter } from "next/router";
import { useCart } from "../components/CartContext";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = React.useState({
    nombre: "", dni: "", email: "", telefono: "",
    domicilio: "", provincia: "", localidad: "", codigoPostal: "",
    entreCalles: "", observaciones: ""
  });

  const disabled = items.length === 0;
  function onChange(e){ setForm((f)=>({ ...f, [e.target.name]: e.target.value })); }

  function saveOrderAndChat() {
    const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const now = new Date().toISOString();
    const brands = Array.from(new Set(items.map((i) => i.brand || "marca-1")));
    const order = { id: orderId, createdAt: now, items, total, shipping: form, brands, status: "pendiente" };

    try {
      const raw = localStorage.getItem("cabure_orders");
      const all = raw ? JSON.parse(raw) : [];
      all.push(order);
      localStorage.setItem("cabure_orders", JSON.stringify(all));
    } catch {}

    const chat = {
      id: orderId, orderId, participants: ["Cliente", ...brands.map((b) => `Vendedor:${b}`)],
      messages: [{ from:"Sistema", text:"¡Compra confirmada! Este chat conecta al cliente con la marca para coordinar entrega.", at: now }],
      createdAt: now, expiresAt: new Date(Date.now()+90*24*60*60*1000).toISOString(), closed:false
    };

    try {
      const raw = localStorage.getItem("cabure_chats");
      const all = raw ? JSON.parse(raw) : [];
      all.push(chat);
      localStorage.setItem("cabure_chats", JSON.stringify(all));
    } catch {}

    clearCart();
    router.replace(`/chat/${orderId}`);
  }

  function onSubmit(e){
    e.preventDefault();
    if(disabled) return;
    if(!form.nombre || !form.email || !form.domicilio || !form.codigoPostal){
      alert("Completá al menos Nombre, Email, Domicilio y Código Postal.");
      return;
    }
    saveOrderAndChat();
  }

  return (
    <main className="container">
      <a href="/cart">← Volver al carrito</a>
      <h1 style={{ marginTop: 12 }}>Checkout — Datos de envío</h1>

      {disabled ? (
        <p className="muted">No hay productos en el carrito.</p>
      ) : (
        <>
          <p className="muted">Completá los datos para envío por Correo Argentino.</p>

          <form onSubmit={onSubmit} className="row" style={{ maxWidth: 640 }}>
            <div className="row">
              <label>Nombre completo *</label>
              <input className="input" name="nombre" value={form.nombre} onChange={onChange} required />
            </div>

            <div className="row">
              <label>DNI</label>
              <input className="input" name="dni" value={form.dni} onChange={onChange} />
            </div>

            <div className="row">
              <label>Email *</label>
              <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
            </div>

            <div className="row">
              <label>Teléfono</label>
              <input className="input" name="telefono" value={form.telefono} onChange={onChange} />
            </div>

            <div className="row">
              <label>Domicilio (calle y número) *</label>
              <input className="input" name="domicilio" value={form.domicilio} onChange={onChange} required />
            </div>

            <div className="row">
              <label>Provincia</label>
              <input className="input" name="provincia" value={form.provincia} onChange={onChange} />
            </div>

            <div className="row">
              <label>Localidad</label>
              <input className="input" name="localidad" value={form.localidad} onChange={onChange} />
            </div>

            <div className="row">
              <label>Código Postal *</label>
              <input className="input" name="codigoPostal" value={form.codigoPostal} onChange={onChange} required />
            </div>

            <div className="row">
              <label>Entre calles (opcional)</label>
              <input className="input" name="entreCalles" value={form.entreCalles} onChange={onChange} />
            </div>

            <div className="row">
              <label>Observaciones</label>
              <textarea className="textarea" name="observaciones" value={form.observaciones} onChange={onChange} rows={3} />
            </div>

            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" type="submit">Confirmar compra y abrir chat</button>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
