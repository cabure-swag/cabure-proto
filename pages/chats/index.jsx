import React from "react";

export default function ChatsListPage() {
  const [chats, setChats] = React.useState([]);
  React.useEffect(()=>{
    const raw = localStorage.getItem("cabure_chats");
    const all = raw ? JSON.parse(raw) : [];
    setChats(all);
  }, []);

  return (
    <main className="container">
      <a href="/">← Volver a la tienda</a>
      <h1 style={{ marginTop: 12 }}>Mis chats</h1>

      {chats.length === 0 ? (
        <p className="muted">No tenés chats aún.</p>
      ) : (
        <ul className="list">
          {chats.map((c) => (
            <li key={c.id} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong>Pedido {c.orderId}</strong>
                {c.closed && <span className="muted">· Cerrado</span>}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>
                {new Date(c.createdAt).toLocaleString("es-AR")} — Participantes: {c.participants.join(", ")}
              </div>
              <div style={{ marginTop: 6 }}>
                <a href={`/chat/${c.id}`}>Abrir chat</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
