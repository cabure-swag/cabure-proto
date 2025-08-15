
# CABURE Proto

Prototipo minimal con Next.js + Supabase Auth (Google), Home de Marcas, Catálogo por categoría, Carrito y Chat de compra (en localStorage).

## Paso 1 — Variables de entorno
Copiá `.env.local.example` a `.env.local` y poné tus valores reales:

```
NEXT_PUBLIC_SUPABASE_URL= https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= ...
```

> Para producción en Vercel, cargá esas dos variables en **Settings → Environment Variables**.

## Paso 2 — Instalar y correr en local
```
npm install
npm run dev
```

## Estructura
- `pages/` rutas Next.js
- `data/` datos de demo (marcas y productos)
- `components/CartContext.js` carrito con persistencia en localStorage
- `components/ChatView.js` chat de la compra, persistido en localStorage
- `lib/supabaseClient.js` cliente Supabase

## Flujo
1. Home → muestra marcas.
2. Marca → categorías (Ropa: Remera, Pantalon, Buzo, Campera; y Otros).
3. Subcategoría → lista de productos demo y botón **Agregar** (con cantidad) → **Carrito**.
4. Carrito → **Continuar al checkout**.
5. Checkout → datos de envío (Correo Argentino) → **Confirmar compra y abrir chat**.
6. Chat → conversación cliente (demo); historial en **/chats**.

> Retención de chats por 3 meses (campo `expiresAt`). Limpieza real se haría con una función programada (cron) en el backend.
