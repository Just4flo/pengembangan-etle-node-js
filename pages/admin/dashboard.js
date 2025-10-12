import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Hanya impor db
import AdminLayout from '../../components/admin/AdminLayout';
import { FaCar, FaCog, FaUser, FaRoad, FaExclamationTriangle, FaFileUpload, FaPlus, FaSpinner } from 'react-icons/fa';

const generateRef = () => `REF${Date.now()}`;

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
        jenisPelanggaran: '', lokasi: '', status: 'Belum Dikonfirmasi'
    });
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const processedValue = id === 'noPolisi' ? value.toUpperCase() : value;
        setFormData({ ...formData, [id]: processedValue });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBuktiFoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!buktiFoto) {
            setMessage({ type: 'error', text: 'Harap unggah foto bukti pelanggaran.' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: 'info', text: 'Mengunggah gambar ke server...' });

        try {
            // 1. Siapkan data form untuk dikirim ke API Route
            const body = new FormData();
            body.append('file', buktiFoto);

            // 2. Panggil API Route untuk mengunggah ke Cloudinary
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: body,
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Gagal mengunggah gambar.');
            }

            const cloudinaryUrl = data.url; // URL gambar dari Cloudinary

            // 3. Simpan data ke Firestore dengan URL dari Cloudinary
            setMessage({ type: 'info', text: 'Menyimpan data pelanggaran...' });
            const noReferensi = generateRef();
            const dataToSave = {
                ...formData,
                noReferensi,
                urlFotoBukti: cloudinaryUrl, // Simpan URL Cloudinary
                tanggalPelanggaran: serverTimestamp(),
            };

            await setDoc(doc(db, 'pelanggaran', formData.noPolisi), dataToSave);

            setMessage({ type: 'success', text: `Data untuk ${formData.noPolisi} berhasil ditambahkan!` });
            // Reset form
            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
                jenisPelanggaran: '', lokasi: '', status: 'Belum Dikonfirmasi'
            });
            setBuktiFoto(null);
            e.target.reset();

        } catch (error) {
            console.error("Error submitting form: ", error);
            setMessage({ type: 'error', text: `Terjadi kesalahan: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Input Data Pelanggaran Baru</h2>
                    <p className="text-slate-500 mt-2">Masukkan detail pelanggaran yang tercatat oleh sistem ETLE.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pesan Feedback */}
                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' :
                                message.type === 'error' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Grid Form Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ... (semua elemen input Anda tetap sama) ... */}
                        <div className="relative">
                            <FaCar className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noPolisi" value={formData.noPolisi} onChange={handleInputChange} placeholder="No. Polisi / TNKB" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaCog className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noRangka" value={formData.noRangka} onChange={handleInputChange} placeholder="No. Rangka" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaCog className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noMesin" value={formData.noMesin} onChange={handleInputChange} placeholder="No. Mesin" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaUser className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="pemilik" value={formData.pemilik} onChange={handleInputChange} placeholder="Nama Pemilik" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative md:col-span-2">
                            <FaExclamationTriangle className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="jenisPelanggaran" value={formData.jenisPelanggaran} onChange={handleInputChange} placeholder="Jenis Pelanggaran" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative md:col-span-2">
                            <FaRoad className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Lokasi Pelanggaran" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                    </div>

                    {/* Input File */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Foto Bukti Pelanggaran</label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                            <div className="text-center">
                                <FaFileUpload className="mx-auto h-12 w-12 text-slate-300" />
                                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
                                        <span>Unggah file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="pl-1">atau seret dan lepas</p>
                                </div>
                                {buktiFoto && <p className="text-sm text-slate-500 mt-2">{buktiFoto.name}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-3 w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        <span>{isLoading ? 'Memproses...' : 'Simpan Data Pelanggaran'}</span>
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}