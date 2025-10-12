import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

export default function SyaratKetentuanPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow bg-white py-16 md:py-24 px-6">
                <div className="container mx-auto max-w-3xl">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Syarat & Ketentuan</h1>
                    <p className="text-slate-500 mb-8">Terakhir diperbarui: 13 Oktober 2025</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <p>
                            Dengan mengakses dan menggunakan situs web ETLE Nasional ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diizinkan untuk menggunakan Layanan.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">1. Penggunaan Layanan</h2>
                        <p>
                            Layanan ini disediakan untuk tujuan melakukan pengecekan data kendaraan dan konfirmasi pelanggaran lalu lintas yang terdeteksi oleh sistem ETLE. Anda setuju untuk tidak menggunakan layanan ini untuk tujuan yang melanggar hukum atau dilarang oleh ketentuan ini.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">2. Kewajiban Pengguna</h2>
                        <p>
                            Anda bertanggung jawab penuh atas keakuratan informasi yang Anda masukkan ke dalam sistem, termasuk Nomor Polisi, Nomor Rangka, Nomor Mesin, dan Nomor Referensi. Memberikan informasi yang tidak benar atau menyesatkan dapat mengakibatkan konsekuensi hukum.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">3. Batasan Tanggung Jawab</h2>
                        <p>
                            Layanan ini disediakan "sebagaimana adanya". Kami tidak menjamin bahwa informasi yang ditampilkan selalu akurat atau bebas dari kesalahan. Keputusan yang dibuat berdasarkan informasi dari situs ini adalah tanggung jawab Anda sepenuhnya. Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan layanan ini.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">4. Perubahan Ketentuan</h2>
                        <p>
                            Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Syarat dan Ketentuan ini kapan saja. Dengan terus mengakses atau menggunakan Layanan kami setelah revisi tersebut berlaku, Anda setuju untuk terikat oleh ketentuan yang direvisi.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 pt-4">5. Hukum yang Berlaku</h2>
                        <p>
                            Syarat dan Ketentuan ini akan diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia, tanpa memperhatikan pertentangan ketentuan hukumnya.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}