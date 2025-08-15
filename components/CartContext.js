
import React from "react";
const CartContext = React.createContext();
export function CartProvider({ children }) {
  const [items, setItems] = React.useState([]);
  React.useEffect(()=>{ try{ const raw=localStorage.getItem("cabure_cart"); if(raw) setItems(JSON.parse(raw)); }catch{} },[]);
  React.useEffect(()=>{ try{ localStorage.setItem("cabure_cart", JSON.stringify(items)); }catch{} },[items]);
  function addItem(product, qty=1){ setItems(prev=>{ const idx=prev.findIndex(p=>p.id===product.id); if(idx>=0){ const copy=[...prev]; copy[idx]={...copy[idx], qty: copy[idx].qty+qty}; return copy;} return [...prev, {...product, qty}] }); }
  function removeItem(id){ setItems(prev=>prev.filter(p=>p.id!==id)); }
  function clearCart(){ setItems([]); }
  const total = items.reduce((sum,p)=> sum + p.price*p.qty, 0);
  return <CartContext.Provider value={{items, addItem, removeItem, clearCart, total}}>{children}</CartContext.Provider>
}
export function useCart(){ const ctx = React.useContext(CartContext); if(!ctx) throw new Error("useCart must be used within CartProvider"); return ctx; }
