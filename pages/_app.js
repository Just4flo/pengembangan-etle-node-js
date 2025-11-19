// pages/_app.js
import "@/styles/globals.css"; // Sesuaikan dengan import CSS Anda
import Chatbot from "../components/Chatbot"; // Import Chatbot

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Komponen Halaman Utama */}
      <Component {...pageProps} />

      {/* Chatbot akan selalu ada di atas semua halaman */}
      <Chatbot />
    </>
  );
}