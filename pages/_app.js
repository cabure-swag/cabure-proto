import '../styles/globals.css';
import { CartProvider } from '../components/CartContext';
import Header from '../components/Header';
export default function App({ Component, pageProps }){
  return (<CartProvider><Header /><Component {...pageProps} /></CartProvider>);
}
