
CABURE.STORE PRO — Next.js + Supabase + Realtime + Mercado Pago

1) Variables en Vercel:
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=
- MERCADOPAGO_ACCESS_TOKEN= (sandbox o productivo)
- APP_URL=https://tuapp.vercel.app

2) Supabase:
- Ejecutá supabase/schema.sql
- Activá Realtime en Database → Replication para tablas chats y chat_messages
- Hacete admin insertando tu user_id en profiles

3) Rutas:
- /  marcas
- /marcas/[slug]  catálogo
- /cart  carrito (cantidades)
- /checkout  pago (MP / transferencia)
- /chats y /chat/[id]  chats
- /support  chat de soporte
- /vendor  panel vendedor
- /admin y /admin/support  panel admin
