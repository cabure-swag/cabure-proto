// pages/checkout.jsx
import React from "react";
import { useRouter } from "next/router";
import { useCart } from "../components/CartContext";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = React.useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    domicilio: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
    entreCalles: "",
    observaciones: ""
  });

  const disabled = items.length === 0;

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function saveOrderAndChat() {
    const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const now = new Date().toISOString();
    const brands = Array.from(new Set(items.map((i) => i.brand || "marca-1")));

    const order = {
      id: orderId,
      createdAt: now,
      items,
      total,
      shipping: form,
      brands,
      status: "pendiente"
    };

    try {
      const raw = localStorage.getItem("cabure_orders");
      const all = raw ? JSON.parse(raw) : [];
      all.push(order);
      localStorage.setItem("cabure_orders", JSON.stringify(all));
    } catch {}

    const initialMsg = {
      from: "Sistema",
      text: "¡Compra confirmada! Este chat conecta al cliente con la marca para coordinar entrega.",
      at: now
    };

    const chat = {
      id: orderId,
      orderId,
      participants: ["Cliente", ...brands.map((b) => `Vendedor:${b}`)],
      messages: [initialMsg],
      createdAt: now,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      closed: false
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

  function onSubmit(e) {
    e.preventDefault();
    if (disabled) return;
    if (!form.nombre || !form.email || !form.domicilio || !form.codigoPostal) {
      alert("Completá al menos Nombre, Email, Domicilio y Código Postal.");
      return;
    }
    saveOrderAndChat();
  }

  return (
    <main style={{ padding: 20, fontFamily: "Inter, system-ui, Arial", maxWidth: 980, margin: "0 auto" }}>
      <a href="/cart" style={{ textDecoration: "none" }}>← Volver al carrito</a>
      <h1 style={{ marginTop: 12 }}>Checkout — Datos de envío</h1>

      {disabled ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <p style={{ color: "#6b7280" }}>
            Completá los datos para envío por Correo Argentino.
          </p>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Nombre completo *</label>
              <input name="nombre" value={form.nombre} onChange={onChange} required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>DNI</label>
              <input name="dni" value={form.dni} onChange={onChange} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={onChange} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Domicilio (calle y número) *</label>
              <input name="domicilio" value={form.domicilio} onChange={onChange} required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Provincia</label>
              <input name="provincia" value={form.provincia} onChange={onChange} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Localidad</label>
              <input name="localidad" value={form.localidad} onChange={onChange} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Código Postal *</label>
              <input name="codigoPostal" value={form.codigoPostal} onChange={onChange} required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Entre calles (opcional)</label>
              <input name="entreCalles" value={form.entreCalles} onChange={onChange} />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Observaciones</label>
              <textarea name="observaciones" value={form.observaciones} onChange={onChange} rows={3} />
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="submit">Confirmar compra y abrir chat</button>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
