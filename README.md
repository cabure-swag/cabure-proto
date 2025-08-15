
CABURE.STORE PRO+ — Next.js + Supabase + Realtime + Mercado Pago por marca

Incluye:
- Header con logo + CABURE.STORE (link al Home), Soporte, Carrito, Chats y Dashboard por rol.
- Home de marcas con logo propio (logo_url) o badge de color.
- Perfil de marca (/marcas/[slug]) con edición (descripción, logo_url, Alias/CBU, **Mercado Pago Access Token por marca**).
- Carrito con cantidades y Checkout con datos de envío.
- Pagos: API /api/mp/create lee el **token por marca** desde Supabase con **Service Role** (seguro, sólo server). Fallback a token global.
- Chats: soporte y post-compra (realtime).
- Panel Vendedor: CRUD de productos + **Estadísticas** (/vendor/analytics) con ventas por mes, ingresos, pedidos, unidades y top productos.
- Panel Admin: crear marcas, asignar vendedores, ver soporte.

ENV en Vercel:
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=
- APP_URL= https://tuapp.vercel.app
- MERCADOPAGO_ACCESS_TOKEN= (opcional, token global de fallback)
- SUPABASE_SERVICE_ROLE= (obligatorio para que /api/mp/create lea el token por marca — nunca poner NEXT_PUBLIC)

DB:
1) Ejecutá supabase/schema.sql
2) Realtime: activar para tablas chats y chat_messages en Database → Replication
3) Hacete admin insertando tu user_id en profiles

Rutas:
/  marcas
/marcas/[slug]  catálogo + edición de medios de pago (si sos admin/vendedor)
/cart, /checkout
/chats, /chat/[id], /support
/vendor  y  /vendor/analytics?brand=<brand_id>
/admin  y  /admin/support
