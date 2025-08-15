import React from 'react';
import { useRouter } from 'next/router';
import { BRANDS } from '../../data/brands';

const CATEGORIES = [
  { name: 'Ropa', sub: ['Remera', 'Pantalon', 'Buzo', 'Campera'] },
  { name: 'Otros', sub: [] }
];

export default function BrandPage() {
  const router = useRouter();
  const { slug } = router.query;
  const brand = BRANDS.find(b => b.slug === slug);

  if (!brand) {
    return (
      <main className="container">
        <a href="/">← Volver</a>
        <h1 style={{ marginTop: 12 }}>Marca no encontrada</h1>
        <p>Verificá el link o volvé a la página principal.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <a href="/">← Volver</a>

      <header className="header" style={{marginTop:12, marginBottom:8}}>
        <div className="logoBadge" style={{background: brand.logoColor}} title={brand.name}>
          {brand.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <h1 style={{ margin: 0 }}>{brand.name}</h1>
        <a href="/cart" className="btn" style={{ marginLeft: 'auto' }}>🛒 Ver carrito</a>
      </header>

      <p className="muted">Elegí una categoría para ver el catálogo de {brand.name}.</p>

      <section className="grid" style={{marginTop:12}}>
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="card">
            <h2 style={{ marginTop: 0 }}>{cat.name}</h2>

            {cat.name === 'Ropa' && (
              <ul className="list" style={{ marginTop: 8 }}>
                {cat.sub.map((s) => {
                  const subSlug = s.toLowerCase();
                  return (
                    <li key={s} style={{ marginBottom: 6 }}>
                      <a href={`/marcas/${brand.slug}/${subSlug}`}>{s}</a>
                    </li>
                  );
                })}
              </ul>
            )}

            {cat.name === 'Otros' && (
              <div className="muted">
                <a href={`/marcas/${brand.slug}/otros`}>Ver “Otros”</a>
              </div>
            )}

            <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              * Próximo paso: catálogo + carrito por categoría.
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
