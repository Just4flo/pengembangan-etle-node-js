import { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Image from 'next/image'; // Impor komponen Image
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
// Impor ikon yang akan kita gunakan
import { FaCheckCircle, FaTimesCircle, FaCar, FaCog, FaHashtag, FaSearch, FaUndo } from 'react-icons/fa';

export default function CekDataPage() {
    const [noPolisi, setNoPolisi] = useState('');
    const [noRangka, setNoRangka] = useState('');
    const [noMesin, setNoMesin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setVehicleData(null);

        try {
            // Trim input untuk membersihkan spasi yang tidak disengaja
            const cleanNoPolisi = noPolisi.trim();
            const cleanNoRangka = noRangka.trim();
            const cleanNoMesin = noMesin.trim();

            const docRef = doc(db, 'kendaraan', cleanNoPolisi);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.noRangka === cleanNoRangka && data.noMesin === cleanNoMesin) {
                    setVehicleData({ found: true, details: data });
                } else {
                    setVehicleData({ found: false, message: 'Kombinasi No. Rangka dan No. Mesin tidak cocok dengan No. Polisi.' });
                }
            } else {
                setVehicleData({ found: false, message: 'Data kendaraan tidak ditemukan di database.' });
            }
        } catch (error) {
            console.error("Error fetching document: ", error);
            setVehicleData({ found: false, message: 'Terjadi kesalahan saat menghubungi server.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk mereset form
    const handleReset = () => {
        setNoPolisi('');
        setNoRangka('');
        setNoMesin('');
        setVehicleData(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-gray-100 p-4 pt-24 pb-12">
                <div className="w-full max-w-5xl p-8 bg-white rounded-2xl shadow-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-blue-600">Cek Data Kendaraan</h1>
                        <p className="text-slate-500 mt-2">
                            Pengecekan denda ETLE diperuntukkan bagi mereka yang berkepentingan dalam jual beli dan persewaan kendaraan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Kolom Kiri: Form Input */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input No. Polisi */}
                            <div className="relative">
                                <label htmlFor="noPolisi" className="block text-sm font-semibold text-slate-700 mb-2">
                                    <FaCar className="inline mr-2" />No. Polisi/NRKB <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noPolisi" value={noPolisi} onChange={(e) => setNoPolisi(e.target.value.toUpperCase())} className="w-full p-3 pl-4 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 text-slate-900 transition-colors" placeholder=" " required />
                                <p className="text-xs text-gray-400 mt-1">Contoh: B1234XYZ</p>
                            </div>

                            {/* Input No. Rangka */}
                            <div className="relative">
                                <label htmlFor="noRangka" className="block text-sm font-semibold text-slate-700 mb-2">
                                    <FaHashtag className="inline mr-2" />No. Rangka <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noRangka" value={noRangka} onChange={(e) => setNoRangka(e.target.value)} className="w-full p-3 pl-4 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 text-slate-900 transition-colors" placeholder="Masukkan nomor rangka kendaraan" required />
                            </div>

                            {/* Input No. Mesin */}
                            <div className="relative">
                                <label htmlFor="noMesin" className="block text-sm font-semibold text-slate-700 mb-2">
                                    <FaCog className="inline mr-2" />No. Mesin <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noMesin" value={noMesin} onChange={(e) => setNoMesin(e.target.value)} className="w-full p-3 pl-4 border-b-2 border-gray-200 focus:outline-none focus:border-blue-500 text-slate-900 transition-colors" placeholder="Masukkan nomor mesin kendaraan" required />
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center gap-4 pt-4">
                                <button type="button" onClick={handleReset} className="flex items-center justify-center gap-2 w-1/2 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                    <FaUndo /> Batal
                                </button>
                                <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 w-1/2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                                    <FaSearch /> {isLoading ? 'Mencari...' : 'Cek Data'}
                                </button>
                            </div>
                        </form>

                        {/* Kolom Kanan: Ilustrasi & Hasil */}
                        <div className="space-y-6">
                            {/* Tampilan Default */}
                            {!vehicleData && (
                                <>
                                    <Image src="/cek_kendaraan.svg" alt="Ilustrasi verifikasi" width={400} height={300} className="mx-auto" />
                                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-lg">
                                        <h3 className="font-bold mb-2">Informasi</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">✔️ <span className="ml-2">Pastikan data yang dimasukkan sesuai dengan STNK.</span></li>
                                            <li className="flex items-start">✔️ <span className="ml-2">Proses pengecekan membutuhkan waktu beberapa detik.</span></li>
                                            <li className="flex items-start">✔️ <span className="ml-2">Data yang ditampilkan adalah data resmi kepolisian.</span></li>
                                        </ul>
                                    </div>
                                </>
                            )}
                            {/* ... (bagian tampilan hasil tetap sama) ... */}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}