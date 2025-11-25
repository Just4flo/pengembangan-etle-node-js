// pages/_app.js
import "@/styles/globals.css";
import { useRouter } from 'next/router';
import Chatbot from "../components/Chatbot";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Daftar path yang TIDAK menampilkan chatbot
  const hideChatbotPaths = [
    '/admin/login',
    '/admin/dashboard',
    '/admin/data-kendaraan',
    '/admin/input-kendaraan',
    '/admin/data-pelanggaran',
    '/admin/feedback',
    '/admin/riwayat-pembayaran',
    // Tambahkan path admin lainnya di sini
  ];

  // Cek apakah current path termasuk dalam daftar hideChatbotPaths
  const shouldHideChatbot = hideChatbotPaths.some(path =>
    router.pathname.startsWith(path)
  );

  return (
    <>
      {/* Komponen Halaman Utama */}
      <Component {...pageProps} />

      {/* Chatbot hanya ditampilkan jika bukan di halaman admin atau login */}
      {!shouldHideChatbot && <Chatbot />}
    </>
  );
}