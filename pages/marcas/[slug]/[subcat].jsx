import React from "react";
import { useRouter } from "next/router";
import { BRANDS } from "../../../data/brands";
import { PRODUCTS, VALID_SUBCATS } from "../../../data/products";
import { useCart } from "../../../components/CartContext";

export default function SubcategoryPage() {
  const router = useRouter();
  const { slug, subcat } = router.query;
  const { addItem } = useCart();

  if (!slug || !subcat) return null;

  const brand = BRANDS.find((b) => b.slug === slug);
  const valid = VALID_SUBCATS.includes(subcat);
  const list = (PRODUCTS[slug] && PRODUCTS[slug][subcat]) || [];

  if (!brand) {
    return (
      <main className="container">
        <a href="/">← Volver</a>
        <h1 style={{ marginTop: 12 }}>Marca no encontrada</h1>
      </main>
    );
  }

  if (!valid) {
    return (
      <main className="container">
        <a href={`/marcas/${slug}`}>← Volver a {brand.name}</a>
        <h1 style={{ marginTop: 12 }}>Categoría no válida</h1>
        <p>Las categorías disponibles son: remera, pantalon, buzo, campera, otros.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <a href={`/marcas/${slug}`}>← Volver a {brand.name}</a>
      <header className="header" style={{marginTop:12, marginBottom:8}}>
        <div className="logoBadge" style={{background: brand.logoColor}}>
          {brand.name.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()}
        </div>
        <h1 style={{ margin: 0 }}>{brand.name} — {subcat.charAt(0).toUpperCase()+subcat.slice(1)}</h1>
        <a href="/cart" className="btn" style={{ marginLeft: 'auto' }}>🛒 Ver carrito</a>
      </header>

      {list.length === 0 ? (
        <p className="muted">No hay productos cargados en esta categoría todavía.</p>
      ) : (
        <section className="grid">
          {list.map((p) => (
            <div key={p.id} className="card">
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div className="muted" style={{ marginTop: 4 }}>
                ${p.price.toLocaleString("es-AR")}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                <QtyAdder onAdd={(qty) => addItem({ ...p, brand: brand.slug }, qty)} />
                <a href="/cart" style={{ marginLeft: "auto" }}>Ver carrito</a>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

function QtyAdder({ onAdd }) {
  const [qty, setQty] = React.useState(1);
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input className="number" type="number" min={1} value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))} style={{ width: 84 }}/>
      <button className="btn btn-primary" onClick={() => onAdd(qty)}>Agregar</button>
    </div>
  );
}
