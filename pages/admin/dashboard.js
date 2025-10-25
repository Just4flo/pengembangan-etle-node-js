// pages/admin/dashboard.js (atau file Anda)
import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaCar, FaCog, FaUser, FaRoad, FaFileUpload, FaPlus, FaSpinner, FaBalanceScale } from 'react-icons/fa';

// Data untuk dropdown jenis pelanggaran
const violationOptions = [
    { value: "UU No. 22 Thn 2009 (Melanggar Marka Jalan)", label: "UU No. 22 Thn 2009 (Melanggar Marka Jalan)" },
    { value: "UU No. 22 Thn 2009 (Tidak Pakai Sabuk Pengaman)", label: "UU No. 22 Thn 2009 (Tidak Pakai Sabuk Pengaman)" },
    { value: "UU No. 22 Thn 2009 (Menggunakan Ponsel)", label: "UU No. 22 Thn 2009 (Menggunakan Ponsel)" },
    { value: "PP No. 80 Thn 2012 (Melanggar Prosedur Pemeriksaan)", label: "PP No. 80 Thn 2012 (Melanggar Prosedur Pemeriksaan)" },
    { value: "Perpol No. 2 Thn 2025 (Pelanggaran Rekaman Elektronik)", label: "Perpol No. 2 Thn 2025 (Pelanggaran Rekaman Elektronik)" },
    { value: "Lainnya", label: "Pelanggaran Lainnya" },
];

// --- BARU: Buat mapping Denda berdasarkan value dari violationOptions ---
const violationFines = {
    "UU No. 22 Thn 2009 (Melanggar Marka Jalan)": 500000,
    "UU No. 22 Thn 2009 (Tidak Pakai Sabuk Pengaman)": 250000,
    "UU No. 22 Thn 2009 (Menggunakan Ponsel)": 750000,
    "PP No. 80 Thn 2012 (Melanggar Prosedur Pemeriksaan)": 500000,
    "Perpol No. 2 Thn 2025 (Pelanggaran Rekaman Elektronik)": 1000000,
    "Lainnya": 0 // Membutuhkan input manual jika 'Lainnya'
};
// ---------------------------------------------------------------------

const generateRef = () => `REF${Date.now()}`;

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
        jenisPelanggaran: '',
        denda: 0, // <-- BARU: Tambahkan denda ke state
        lokasi: '', status: 'Belum Dikonfirmasi'
    });
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- REVISI: Handler untuk input, termasuk denda otomatis ---
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Buat salinan state
        let newFormData = { ...formData };

        // Proses nilai input
        if (id === 'noPolisi') {
            newFormData[id] = value.toUpperCase();
        } else {
            newFormData[id] = value;
        }

        // LOGIKA BARU: Jika jenis pelanggaran diubah, update dendanya
        if (id === 'jenisPelanggaran') {
            const fineAmount = violationFines[value] || 0;
            newFormData['denda'] = fineAmount;
        }

        // Jika denda diubah secara manual (misal jika "Lainnya" dipilih)
        if (id === 'denda') {
            newFormData[id] = parseInt(value, 10) || 0;
        }

        setFormData(newFormData);
    };
    // -------------------------------------------------------------

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBuktiFoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!buktiFoto) {
            // ... (logika cek foto)
        }
        setIsLoading(true);
        setMessage({ type: 'info', text: 'Mengunggah gambar ke server...' });

        try {
            // ... (Logika upload gambar ke /api/upload) ...
            const body = new FormData();
            body.append('file', buktiFoto);
            const response = await fetch('/api/upload', { method: 'POST', body: body });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Gagal mengunggah gambar.');

            const cloudinaryUrl = data.url;
            setMessage({ type: 'info', text: 'Menyimpan data pelanggaran...' });
            const noReferensi = generateRef();

            // --- DIPERBARUI: dataToSave sekarang otomatis menyertakan 'denda' dari formData ---
            const dataToSave = {
                ...formData, // formData sekarang sudah berisi 'denda'
                noReferensi,
                urlFotoBukti: cloudinaryUrl,
                tanggalPelanggaran: serverTimestamp(),
            };
            // ---------------------------------------------------------------------------------

            await setDoc(doc(db, 'pelanggaran', formData.noPolisi), dataToSave);

            setMessage({ type: 'success', text: `Data untuk ${formData.noPolisi} berhasil ditambahkan!` });

            // --- BARU: Reset denda saat form di-clear ---
            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
                jenisPelanggaran: '', denda: 0, lokasi: '', status: 'Belum Dikonfirmasi'
            });
            // ---------------------------------------------
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
                                message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Grid Form Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative"><FaCar className="absolute top-3.5 left-4 text-slate-400" /><input id="noPolisi" value={formData.noPolisi} onChange={handleInputChange} placeholder="No. Polisi / TNKB" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaCog className="absolute top-3.5 left-4 text-slate-400" /><input id="noRangka" value={formData.noRangka} onChange={handleInputChange} placeholder="No. Rangka" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaCog className="absolute top-3.5 left-4 text-slate-400" /><input id="noMesin" value={formData.noMesin} onChange={handleInputChange} placeholder="No. Mesin" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaUser className="absolute top-3.5 left-4 text-slate-400" /><input id="pemilik" value={formData.pemilik} onChange={handleInputChange} placeholder="Nama Pemilik" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>

                        {/* --- PERUBAHAN UI: Jenis Pelanggaran (col-span-1) --- */}
                        <div className="relative md:col-span-1">
                            <FaBalanceScale className="absolute top-3.5 left-4 text-slate-400" />
                            <select
                                id="jenisPelanggaran"
                                value={formData.jenisPelanggaran}
                                onChange={handleInputChange}
                                className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900 bg-white"
                                required
                            >
                                <option value="" disabled>Pilih Jenis Pelanggaran</option>
                                {violationOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* ---------------------------------------------------- */}

                        {/* --- BARU: Input Denda (Otomatis/Readonly) --- */}
                        <div className="relative md:col-span-1">
                            <span className="absolute top-3 left-4 text-slate-500 font-bold">Rp</span>
                            <input
                                id="denda"
                                value={formData.denda.toLocaleString('id-ID')} // Format sebagai mata uang
                                onChange={handleInputChange} // Memungkinkan perubahan jika "Lainnya" dipilih
                                placeholder="Jumlah Denda"
                                className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900 bg-slate-50" // Dibuat abu-abu
                                // Hapus 'readOnly' jika Anda ingin admin bisa mengedit denda 'Lainnya'
                                readOnly={formData.jenisPelanggaran !== 'Lainnya'}
                                type="number"
                            />
                        </div>
                        {/* ---------------------------------------------------- */}

                        <div className="relative md:col-span-2">
                            <FaRoad className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Lokasi Pelanggaran" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                    </div>

                    {/* Input File (tetap sama) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Foto Bukti Pelanggaran</label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
                            {/* ... (Konten upload file) ... */}
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