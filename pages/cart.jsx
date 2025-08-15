// pages/cart.jsx
import React from "react";
import { useCart } from "../components/CartContext";

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();

  return (
    <main style={{ padding: 20, fontFamily: "Inter, system-ui, Arial", maxWidth: 980, margin: "0 auto" }}>
      <a href="/" style={{ textDecoration: "none" }}>← Seguir comprando</a>
      <h1 style={{ marginTop: 12 }}>Carrito</h1>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((p) => (
              <li key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Cant: {p.qty} · ${(p.price * p.qty).toLocaleString("es-AR")}
                  </div>
                </div>
                <button onClick={() => removeItem(p.id)}>Eliminar</button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 12, fontWeight: 700 }}>
            Total: ${total.toLocaleString("es-AR")}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <a href="/checkout" style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, textDecoration: "none" }}>
              Continuar al checkout
            </a>
            <button onClick={clearCart}>Vaciar carrito</button>
          </div>
        </>
      )}
    </main>
  );
}
