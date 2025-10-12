import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

export default function KebijakanPrivasiPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow bg-white py-16 md:py-24 px-6">
                <div className="container mx-auto max-w-3xl">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Kebijakan Privasi</h1>
                    <p className="text-slate-500 mb-8">Terakhir diperbarui: 13 Oktober 2025</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <p>
                            Selamat datang di situs web ETLE Nasional. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan layanan kami.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">1. Informasi yang Kami Kumpulkan</h2>
                        <p>
                            Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan kami, termasuk namun tidak terbatas pada:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Data Kendaraan (Nomor Polisi, Nomor Rangka, Nomor Mesin).</li>
                            <li>Data Pelanggaran (Nomor Referensi).</li>
                            <li>Data Konfirmasi (Informasi mengenai pengemudi saat pelanggaran terjadi).</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                        <p>
                            Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Untuk memverifikasi dan memproses konfirmasi pelanggaran lalu lintas.</li>
                            <li>Untuk menyediakan informasi terkait status pelanggaran dan pembayaran denda.</li>
                            <li>Untuk keperluan administratif internal dan penegakan hukum sesuai dengan peraturan yang berlaku.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">3. Keamanan Data</h2>
                        <p>
                            Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data Anda dari akses, pengungkapan, perubahan, atau penghancuran yang tidak sah. Data Anda disimpan di server yang aman.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">4. Perubahan pada Kebijakan Ini</h2>
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini, dan kami menyarankan Anda untuk meninjaunya secara berkala.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">5. Hubungi Kami</h2>
                        <p>
                            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="/kontak" className="text-blue-600 hover:underline">Kontak</a> kami.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}