import Link from 'next/link';
import Image from 'next/image';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { FaCameraRetro, FaIdCard, FaEnvelope, FaDesktop, FaFileInvoiceDollar, FaBan } from 'react-icons/fa';

export default function Home() {
  const etleSteps = [
    { num: 1, title: "Tahap 1", description: "Perangkat secara otomatis menangkap pelanggaran lalu lintas dan mengirimkan bukti pelanggaran ke Back Office ETLE." },
    { num: 2, title: "Tahap 2", description: "Petugas mengidentifikasi Data Kendaraan menggunakan Electronic Registration & Identifikasi (ERI) sebagai sumber data." },
    { num: 3, title: "Tahap 3", description: "Petugas mengirimkan surat konfirmasi ke alamat pemilik kendaraan untuk permohonan konfirmasi atas pelanggaran." },
    { num: 4, title: "Tahap 4", description: "Pemilik kendaraan melakukan konfirmasi via Website atau datang langsung ke Posko Penegakan Hukum ETLE." },
    { num: 5, title: "Tahap 5", description: "Petugas menerbitkan Tilang dengan metode pembayaran via BRIVA untuk setiap pelanggaran yang telah terverifikasi." },
    { num: 6, title: "Tahap 6", description: "Kegagalan pemilik untuk konfirmasi akan mengakibatkan blokir STNK sementara." }
  ];

  const stepIcons = [FaCameraRetro, FaIdCard, FaEnvelope, FaDesktop, FaFileInvoiceDollar, FaBan];

  const latestVideos = [
    { title: "HUT LALU LINTAS BHAYANGKARA KE-69 2024", channel: "@NTMCKorlantasPolri", thumbnail: "/images/video1.jpg", href: "#" },
    { title: "Lapor NTMC | Shock, kaget liat kelakuan pengendara di Konoha", channel: "@NTMCKorlantasPolri", thumbnail: "/images/video2.jpg", href: "#" },
    { title: "Lapor NTMC | JANGAN DIPAKSA, NYALIP YA MAS, BAHAYA!!!", channel: "@NTMCKorlantasPolri", thumbnail: "/images/video3.jpg", href: "#" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
      <Navbar />

      <main className="flex-grow">

        {/* === HERO SECTION === */}
        <section className="bg-white text-slate-800">
          <div className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Konfirmasi Pelanggaran Melalui Website
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Masukkan no referensi pelanggaran dan No. Pol / TNKB untuk melakukan pengecekan pelanggaran yang dibebankan kepada kendaraan Anda.
              </p>
              <Link href="/konfirmasi" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">
                Konfirmasi Pelanggaran
              </Link>
            </div>
            <div className="mt-8 md:mt-0">
              <Image src="/image-section1.svg" alt="Ilustrasi Konfirmasi ETLE" width={600} height={400} />
            </div>
          </div>
        </section>

        {/* === CEK DATA CARD (Kartu dengan BG Menonjol) === */}
        {/* 📌 PERUBAHAN 1: Section luar tidak memiliki BG, hanya card dalamnya */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            {/* Gunakan kode warna yang sama persis dengan yang Anda gunakan di Photopea */}
            <div className="bg-[#1A2B4B] rounded-2xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                {/* Gambar 'banner.png' baru Anda akan dipanggil di sini */}
                <Image src="/banner.png" alt="Ilustrasi Cek Kendaraan" width={500} height={300} className="relative" />
              </div>
              <div className="text-white text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3">Cek Data Kendaraan</h2>
                <p className="text-slate-300 mb-6">
                  Pengecekan denda ETLE diperuntukkan bagi mereka yang berkepentingan dalam jual beli dan persewaan kendaraan.
                </p>
                <Link href="/cek-data" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300">
                  Cek Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* === MEKANISME ETLE (Section dengan BG Sedikit Terang) === */}
        {/* 📌 PERUBAHAN 2: Latar belakang section diubah menjadi bg-slate-800 */}
        <section className="pt-24 pb-24 bg-slate-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
              <div>
                <h2 className="text-4xl font-extrabold text-white">Mekanisme ETLE</h2>
                <p className="mt-4 text-slate-400">
                  Electronic Traffic Law Enforcement (ETLE) Nasional di Korlantas POLRI adalah implementasi teknologi untuk mencatat pelanggaran-pelanggaran dalam berlalu lintas secara elektronik untuk mendukung keamanan, ketertiban, keselamatan dan ketertiban dalam berlalu lintas.
                </p>
              </div>
              <div className="flex justify-center mt-8 md:mt-0">
                <Image src="/cctv.svg" alt="Ilustrasi CCTV ETLE" width={400} height={300} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {etleSteps.map((step) => {
                const IconComponent = stepIcons[step.num - 1];
                return (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{step.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* === VIDEO TERBARU === */}
        <section className="py-16 bg-white text-slate-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
              Yuk, ikuti video terbaru dari Korlantas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestVideos.map((video) => (
                <a key={video.title} href={video.href} target="_blank" rel="noopener noreferrer" className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <Image src={video.thumbnail} alt={video.title} width={600} height={400} className="w-full object-cover" />
                  <div className="p-4 bg-white">
                    <h3 className="font-bold group-hover:text-blue-600 transition-colors">{video.title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{video.channel}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* === QUOTES SECTION === */}
        <section className="py-20 bg-white text-slate-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-slate-900 mb-4">
              Quotes
            </h2>
            <p className="max-w-3xl mx-auto text-slate-600 mb-12">
              Keselamatan dan ketertiban dalam berlalu lintas. Pemetaan data kecelakaan menunjukkan keterkaitan antara tingginya pelanggaran dengan kecelakaan fatal yang terjadi.
            </p>
            <Image
              src="/quot.svg"
              alt="Ilustrasi Keselamatan Berlalu Lintas"
              width={700}
              height={500}
              className="mx-auto"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}