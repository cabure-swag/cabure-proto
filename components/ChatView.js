// components/ChatView.js
import React from "react";

export default function ChatView({ chatId }) {
  const [chat, setChat] = React.useState(null);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    const raw = localStorage.getItem("cabure_chats");
    const all = raw ? JSON.parse(raw) : [];
    const c = all.find((x) => x.id === chatId);
    setChat(c || null);
  }, [chatId]);

  function persist(updater) {
    const raw = localStorage.getItem("cabure_chats");
    const all = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex((x) => x.id === chatId);
    if (idx === -1) return;
    const updated = updater(all[idx]);
    all[idx] = updated;
    localStorage.setItem("cabure_chats", JSON.stringify(all));
    setChat(updated);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    persist((c) => ({
      ...c,
      messages: [...c.messages, { from: "Cliente", text, at: new Date().toISOString() }]
    }));
    setInput("");
  }

  function closeChat() {
    persist((c) => ({ ...c, closed: true }));
  }

  if (!chat) {
    return <div>Chat no encontrado.</div>;
  }

  const expired = new Date(chat.expiresAt).getTime() < Date.now();

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <strong>Chat del pedido {chat.orderId}</strong>
        {chat.closed && <span style={{ color: "#9ca3af" }}>· Cerrado</span>}
        {expired && <span style={{ color: "#ef4444" }}>· Expirado (3 meses)</span>}
      </div>

      <div style={{ height: 260, overflowY: "auto", padding: 8, background: "#fafafa", border: "1px solid #eee", borderRadius: 8 }}>
        {chat.messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {m.from} — {new Date(m.at).toLocaleString("es-AR")}
            </div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      {!chat.closed && !expired && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={sendMessage}>Enviar</button>
          <button onClick={closeChat}>Finalizar chat</button>
        </div>
      )}
      {(chat.closed || expired) && (
        <div style={{ marginTop: 8, color: "#6b7280" }}>
          El chat no admite nuevos mensajes.
        </div>
      )}
    </div>
  );
}
