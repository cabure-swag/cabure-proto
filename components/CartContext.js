
import React from 'react';
const Ctx=React.createContext();
export function CartProvider({children}){
  const [items,setItems]=React.useState([]);
  React.useEffect(()=>{try{const raw=localStorage.getItem('cabure_cart'); if(raw) setItems(JSON.parse(raw));}catch{}},[]);
  React.useEffect(()=>{try{localStorage.setItem('cabure_cart', JSON.stringify(items));}catch{}},[items]);
  const addItem=(product,qty=1)=>setItems(prev=>{
    const i=prev.findIndex(x=>x.id===product.id);
    if(i>=0){const cp=[...prev]; cp[i]={...cp[i], qty:cp[i].qty+qty}; return cp;}
    return [...prev,{...product,qty}];
  });
  const updateQty=(id,qty)=>setItems(prev=>prev.map(p=>p.id===id?{...p,qty:Math.max(1,qty)}:p));
  const removeItem=(id)=>setItems(prev=>prev.filter(x=>x.id!==id));
  const clearCart=()=>setItems([]);
  const total=items.reduce((s,p)=>s+p.price*p.qty,0);
  return <Ctx.Provider value={{items,addItem,updateQty,removeItem,clearCart,total}}>{children}</Ctx.Provider>
}
export const useCart=()=>React.useContext(Ctx);
