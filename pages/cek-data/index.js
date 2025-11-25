import { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Image from 'next/image';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
    FaCheckCircle, FaTimesCircle, FaCar, FaCog, FaHashtag,
    FaSearch, FaUndo, FaIdCard, FaCalendarAlt, FaPalette, FaSpinner, FaMotorcycle
} from 'react-icons/fa';

export default function CekDataPage() {
    const [noPolisi, setNoPolisi] = useState('');
    const [noRangka, setNoRangka] = useState('');
    const [noMesin, setNoMesin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState(null);
    const [formError, setFormError] = useState(''); // State untuk error validasi form

    // Fungsi untuk mereset form
    const handleReset = () => {
        setNoPolisi('');
        setNoRangka('');
        setNoMesin('');
        setVehicleData(null);
        setFormError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setVehicleData(null);
        setFormError('');

        // 1. BERSIHKAN INPUT
        // Hapus spasi, ubah ke uppercase, dan hapus karakter non-alphanumeric
        const cleanNoPolisi = noPolisi.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const cleanNoRangka = noRangka.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const cleanNoMesin = noMesin.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // 2. VALIDASI KETAT
        // Validasi No Polisi (4-9 karakter)
        if (cleanNoPolisi.length < 4 || cleanNoPolisi.length > 9) {
            setFormError('Nomor Polisi harus terdiri dari 4 hingga 9 karakter huruf dan angka.');
            return;
        }

        // Validasi No Rangka (Tepat 17 karakter)
        if (cleanNoRangka.length !== 17) {
            setFormError(`Nomor Rangka harus tepat 17 karakter. (Anda memasukkan ${cleanNoRangka.length} karakter)`);
            return;
        }

        // Validasi No Mesin (10-14 karakter)
        if (cleanNoMesin.length < 10 || cleanNoMesin.length > 14) {
            setFormError('Nomor Mesin harus terdiri dari 10 hingga 14 karakter.');
            return;
        }

        // Jika lolos validasi, mulai loading
        setIsLoading(true);

        try {
            // 3. QUERY FIREBASE
            const kendaraanRef = collection(db, 'kendaraan');
            // Cari berdasarkan No Polisi yang sudah dibersihkan
            const q = query(kendaraanRef, where("noPolisi", "==", cleanNoPolisi));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();

                // Ambil data dari DB dan bersihkan formatnya untuk perbandingan
                const dbRangka = data.noRangka ? data.noRangka.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
                const dbMesin = data.noMesin ? data.noMesin.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';

                // 4. PENCOCOKAN DATA (VERIFIKASI)
                if (dbRangka === cleanNoRangka && dbMesin === cleanNoMesin) {
                    setVehicleData({ found: true, details: data });
                } else {
                    setVehicleData({ found: false, message: 'Kombinasi No. Rangka dan No. Mesin tidak cocok dengan data kami.' });
                }
            } else {
                setVehicleData({ found: false, message: 'Data kendaraan dengan No. Polisi tersebut tidak ditemukan.' });
            }
        } catch (error) {
            console.error("Error:", error);
            setVehicleData({ found: false, message: 'Terjadi kesalahan koneksi server. Silakan coba lagi nanti.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper format tanggal
    const formatDate = (timestamp) => {
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        return '-';
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 pt-28 pb-12">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Cek Data Kendaraan</h1>
                        <p className="text-gray-500">Pengecekan data kendaraan bermotor resmi kepolisian.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* --- FORM INPUT --- */}
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Input No Polisi */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                    <FaCar className="mr-2" /> No. Polisi/NRKB <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={noPolisi}
                                    // Sanitasi input saat diketik (hanya huruf angka, uppercase)
                                    onChange={(e) => setNoPolisi(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    className={`w-full py-3 border-b-2 bg-transparent outline-none transition-colors text-black text-lg placeholder-gray-400 font-medium ${formError && (noPolisi.length < 4 || noPolisi.length > 9) ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
                                        }`}
                                    placeholder="Contoh: B1234XYZ"
                                    maxLength={9} // Batas HTML
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Min. 4, Max. 9 karakter (Huruf & Angka)</p>
                            </div>

                            {/* Input No Rangka */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                    <FaHashtag className="mr-2" /> No. Rangka <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={noRangka}
                                    onChange={(e) => setNoRangka(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    className={`w-full py-3 border-b-2 bg-transparent outline-none transition-colors text-black text-lg placeholder-gray-400 font-medium ${formError && noRangka.length !== 17 ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
                                        }`}
                                    placeholder="Masukkan nomor rangka (17 digit)"
                                    maxLength={17} // Batas HTML
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Wajib 17 karakter</p>
                            </div>

                            {/* Input No Mesin */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                    <FaCog className="mr-2" /> No. Mesin <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={noMesin}
                                    onChange={(e) => setNoMesin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    className={`w-full py-3 border-b-2 bg-transparent outline-none transition-colors text-black text-lg placeholder-gray-400 font-medium ${formError && (noMesin.length < 10 || noMesin.length > 14) ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
                                        }`}
                                    placeholder="Masukkan nomor mesin"
                                    maxLength={14} // Batas HTML Max
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Min. 10, Max. 14 karakter</p>
                            </div>

                            {/* Pesan Error Validasi Form */}
                            {formError && (
                                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                                    <strong>Perhatian:</strong> {formError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all flex justify-center items-center gap-2"
                                >
                                    <FaUndo /> Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-2/3 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:bg-blue-300"
                                >
                                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                                    {isLoading ? 'Memproses...' : 'Cek Data'}
                                </button>
                            </div>
                        </form>

                        {/* --- KOLOM KANAN: HASIL / ILUSTRASI --- */}
                        <div className="flex flex-col justify-center h-full min-h-[350px]">

                            {!vehicleData && !isLoading && (
                                <div className="text-center animate-fade-in">
                                    <div className="relative w-full h-64 mb-6">
                                        <Image
                                            src="/cek_kendaraan.svg"
                                            alt="Ilustrasi Cek Kendaraan"
                                            layout="fill"
                                            objectFit="contain"
                                            priority
                                        />
                                    </div>
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg text-left shadow-sm">
                                        <h3 className="text-blue-800 font-bold mb-3 text-lg">Informasi</h3>
                                        <ul className="space-y-2 text-blue-900">
                                            <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-500" /> Pastikan data sesuai STNK.</li>
                                            <li className="flex items-center gap-2"><FaCheckCircle className="text-blue-500" /> Data bersumber resmi dari kepolisian.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-64 text-blue-600">
                                    <FaSpinner className="animate-spin text-6xl mb-6" />
                                    <p className="text-lg font-medium">Sedang memverifikasi data...</p>
                                </div>
                            )}

                            {vehicleData && vehicleData.found && !isLoading && (
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up transform transition-all">
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-full">
                                            {/* Tampilkan icon Motor/Mobil berdasarkan jenisKendaraan */}
                                            {vehicleData.details.jenisKendaraan === 'Motor' ? <FaMotorcycle className="text-2xl" /> : <FaCar className="text-2xl" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">Data Ditemukan</h3>
                                            <p className="text-blue-100 text-sm tracking-wider">{vehicleData.details.noPolisi}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-gray-500 text-sm flex items-center gap-2"><FaIdCard /> Pemilik</span>
                                                <span className="font-bold text-gray-900 text-right">{vehicleData.details.namaPemilik}</span>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-gray-500 text-sm">Alamat</span>
                                                <span className="text-gray-800 text-sm text-right w-2/3 leading-snug">{vehicleData.details.alamatPemilik}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-gray-800 border-b pb-2 mb-3 text-sm uppercase tracking-wider">Detail Kendaraan</h4>
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                                                {/* --- TAMPILKAN JENIS KENDARAAN (Mobil/Motor) --- */}
                                                <div className="col-span-2 pb-2 border-b border-gray-100">
                                                    <p className="text-gray-400 text-xs">Jenis Kendaraan</p>
                                                    <p className="font-bold text-blue-600 text-base">{vehicleData.details.jenisKendaraan || '-'}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-400 text-xs">Merk / Model</p>
                                                    <p className="font-bold text-gray-800">{vehicleData.details.merk} {vehicleData.details.model}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Tipe</p>
                                                    <p className="font-bold text-gray-800">{vehicleData.details.tipe}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Tahun</p>
                                                    <p className="font-bold text-gray-800">{vehicleData.details.tahunPembuatan}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Warna</p>
                                                    <p className="font-bold text-gray-800 flex items-center gap-1">
                                                        <FaPalette className="text-gray-400" /> {vehicleData.details.warna}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Isi Silinder</p>
                                                    <p className="font-bold text-gray-800">{vehicleData.details.isiSilinder} CC</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Masa Berlaku</p>
                                                    <p className="font-bold text-blue-600 flex items-center gap-1">
                                                        <FaCalendarAlt /> {formatDate(vehicleData.details.berlakuSampai)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {vehicleData && !vehicleData.found && !isLoading && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-fade-in">
                                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaTimesCircle className="text-4xl text-red-500" />
                                    </div>
                                    <h3 className="text-red-800 font-bold text-xl mb-2">Data Tidak Ditemukan</h3>
                                    <p className="text-red-600 mb-4 font-medium">{vehicleData.message}</p>
                                    <p className="text-gray-500 text-sm bg-white p-3 rounded-lg border border-gray-200 inline-block">
                                        Mohon periksa kembali fisik STNK Anda dan coba lagi.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}