// pages/marcas/[slug].jsx
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
      <main style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial', maxWidth: 980, margin: '0 auto' }}>
        <a href="/" style={{ textDecoration: 'none' }}>← Volver</a>
        <h1 style={{ marginTop: 12 }}>Marca no encontrada</h1>
        <p>Verificá el link o volvé a la página principal.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial', maxWidth: 980, margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none' }}>← Volver</a>

      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: brand.logoColor,
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontWeight: 700
          }}
          title={brand.name}
          aria-label={`Logo de ${brand.name}`}
        >
          {brand.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <h1 style={{ margin: 0 }}>{brand.name}</h1>
        <a href="/cart" style={{ marginLeft: 'auto', textDecoration: 'none' }}>🛒 Ver carrito</a>
      </header>

      <p style={{ color: '#4b5563' }}>
        Elegí una categoría para ver el catálogo de {brand.name}.
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginTop: 12
        }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.name} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
            <h2 style={{ marginTop: 0 }}>{cat.name}</h2>

            {cat.name === 'Ropa' && (
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
                {cat.sub.map((s) => {
                  const subSlug = s.toLowerCase(); // remera, pantalon, buzo, campera
                  return (
                    <li key={s} style={{ marginBottom: 6 }}>
                      <a
                        href={`/marcas/${brand.slug}/${subSlug}`}
                        style={{ textDecoration: 'none', color: '#2563eb' }}
                      >
                        {s}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {cat.name === 'Otros' && (
              <div style={{ color: '#6b7280' }}>
                <a
                  href={`/marcas/${brand.slug}/otros`}
                  style={{ textDecoration: 'none', color: '#2563eb' }}
                >
                  Ver “Otros”
                </a>
              </div>
            )}

            <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af' }}>
              * Próximo paso: catálogo + carrito por categoría.
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
