// pages/chats/index.jsx
import React from "react";

export default function ChatsListPage() {
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    const raw = localStorage.getItem("cabure_chats");
    const all = raw ? JSON.parse(raw) : [];
    setChats(all);
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "Inter, system-ui, Arial", maxWidth: 980, margin: "0 auto" }}>
      <a href="/" style={{ textDecoration: "none" }}>← Volver a la tienda</a>
      <h1 style={{ marginTop: 12 }}>Mis chats</h1>

      {chats.length === 0 ? (
        <p>No tenés chats aún.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chats.map((c) => (
            <li key={c.id} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong>Pedido {c.orderId}</strong>
                {c.closed && <span style={{ color: "#9ca3af" }}>· Cerrado</span>}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {new Date(c.createdAt).toLocaleString("es-AR")} — Participantes: {c.participants.join(", ")}
              </div>
              <div style={{ marginTop: 6 }}>
                <a href={`/chat/${c.id}`} style={{ textDecoration: "none" }}>Abrir chat</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
