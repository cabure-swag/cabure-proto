import '../styles/globals.css';
import Header from '../components/Header';
import { CartProvider } from '../components/CartContext';
export default function App({Component,pageProps}){return(<CartProvider><Header/><Component {...pageProps}/></CartProvider>)}
