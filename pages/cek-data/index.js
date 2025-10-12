import { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import { db } from '../../config/firebase'; // Pastikan path ini benar
import { doc, getDoc } from 'firebase/firestore'; // Gunakan getDoc untuk pencarian berdasarkan ID
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function CekDataPage() {
    const [noPolisi, setNoPolisi] = useState('');
    const [noRangka, setNoRangka] = useState('');
    const [noMesin, setNoMesin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState(null); // State untuk menyimpan data STNK

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setVehicleData(null);

        try {
            // Pencarian langsung ke dokumen berdasarkan No. Polisi (ID Dokumen)
            const docRef = doc(db, 'kendaraan', noPolisi);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Verifikasi tambahan untuk No. Rangka dan No. Mesin
                if (data.noRangka === noRangka && data.noMesin === noMesin) {
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

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-gray-100 p-4 pt-20">
                <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Cek Data Kendaraan</h1>
                        <p className="text-gray-500 mt-2">
                            Verifikasi data kendaraan untuk memastikan keaslian dan kepemilikan yang sah.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Kolom Kiri: Form Input */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ... (bagian form input tetap sama, pastikan ada text-gray-900 di className input) ... */}
                            <div>
                                <label htmlFor="noPolisi" className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="font-bold">No. Polisi/NRKB</span> <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noPolisi" value={noPolisi} onChange={(e) => setNoPolisi(e.target.value.toUpperCase())} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Masukkan nomor polisi" required />
                            </div>
                            <div>
                                <label htmlFor="noRangka" className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="font-bold">No. Rangka</span> <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noRangka" value={noRangka} onChange={(e) => setNoRangka(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Masukkan nomor rangka kendaraan" required />
                            </div>
                            <div>
                                <label htmlFor="noMesin" className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="font-bold">No. Mesin</span> <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="noMesin" value={noMesin} onChange={(e) => setNoMesin(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" placeholder="Masukkan nomor mesin kendaraan" required />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isLoading ? 'Memverifikasi...' : 'Cek Data Kendaraan'}
                            </button>
                        </form>

                        {/* Kolom Kanan: Hasil Pencarian */}
                        <div className="space-y-6">
                            {/* Tampilan Default */}
                            {!vehicleData && (
                                <>
                                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/car-document-verification-8704439-6972626.png" alt="Ilustrasi verifikasi" className="w-full h-auto max-w-sm mx-auto" />
                                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-r-lg">
                                        <h3 className="font-bold mb-2">Informasi</h3>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start"><span>✔️ Pastikan data yang dimasukkan sesuai dengan STNK.</span></li>
                                            <li className="flex items-start"><span>✔️ Data bersumber dari database yang terdaftar.</span></li>
                                        </ul>
                                    </div>
                                </>
                            )}

                            {/* Tampilan Jika Data DITEMUKAN */}
                            {vehicleData && vehicleData.found && (
                                <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                    <h3 className="font-bold text-lg mb-4 flex items-center text-green-900"><FaCheckCircle className="mr-2" /> Data Kendaraan Terverifikasi</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800">
                                        <p><strong>Nama Pemilik:</strong> {vehicleData.details.namaPemilik}</p>
                                        <p><strong>Merk / Model:</strong> {vehicleData.details.merk} {vehicleData.details.model}</p>
                                        <p><strong>Tahun:</strong> {vehicleData.details.tahunPembuatan}</p>
                                        <p><strong>Warna:</strong> {vehicleData.details.warna}</p>
                                        <p><strong>Isi Silinder:</strong> {vehicleData.details.isiSilinder} cc</p>
                                        <p><strong>Berlaku s/d:</strong> {new Date(vehicleData.details.berlakuSampai.seconds * 1000).toLocaleDateString('id-ID')}</p>
                                        <p className="sm:col-span-2"><strong>Alamat:</strong> {vehicleData.details.alamatPemilik}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tampilan Jika Data TIDAK DITEMUKAN */}
                            {vehicleData && !vehicleData.found && (
                                <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                    <h3 className="font-bold text-lg mb-2 flex items-center text-red-900"><FaTimesCircle className="mr-2" /> Verifikasi Gagal</h3>
                                    <p className="text-sm text-gray-800">{vehicleData.message}</p>
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