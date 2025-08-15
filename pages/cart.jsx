import React from "react";
import { useCart } from "../components/CartContext";

export default function CartPage() {
  const { items, removeItem, clearCart, total } = useCart();

  return (
    <main className="container">
      <a href="/">← Seguir comprando</a>
      <h1 style={{ marginTop: 12 }}>Carrito</h1>

      {items.length === 0 ? (
        <p className="muted">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list">
            {items.map((p) => (
              <li key={p.id} className="card" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    Cant: {p.qty} · ${(p.price * p.qty).toLocaleString("es-AR")}
                  </div>
                </div>
                <button className="btn" onClick={() => removeItem(p.id)}>Eliminar</button>
              </li>
            ))}
          </ul>

          <div className="hr"></div>

          <div className="total">
            Total: ${total.toLocaleString("es-AR")}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <a className="btn btn-primary" href="/checkout">Continuar al checkout</a>
            <button className="btn" onClick={clearCart}>Vaciar carrito</button>
          </div>
        </>
      )}
    </main>
  );
}
