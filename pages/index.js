import Link from 'next/link';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

export default function Home() {
  return (
    // 1. Dibungkus dengan satu div utama yang mengatur layout
    // flex flex-col min-h-screen akan memastikan footer menempel di bawah
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      {/* Konten utama dibuat untuk mengisi ruang yang tersedia */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Selamat Datang di Sistem ETLE
        </h1>
        <p className="max-w-2xl text-lg text-gray-700">
          Sistem Elektronik Tilang (ETLE) membantu Anda mengecek dan
          mengonfirmasi pelanggaran lalu lintas secara online dengan mudah
          dan cepat.
        </p>

        {/* 2. Tombol diubah menjadi Link agar bisa pindah halaman */}
        <Link href="/cek-data" className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300">
          Cek Data Sekarang
        </Link>
      </main>

      <Footer />
    </div>
  );
}