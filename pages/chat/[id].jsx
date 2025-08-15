import React from "react";
import { useRouter } from "next/router";
import ChatView from "../../components/ChatView";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;

  return (
    <main className="container">
      <a href="/">← Volver a la tienda</a>
      <h1 style={{ marginTop: 12 }}>Chat de la compra</h1>
      <ChatView chatId={id} />
    </main>
  );
}
