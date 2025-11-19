// pages/admin/dashboard.js
import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaCar, FaCog, FaUser, FaRoad, FaFileUpload, FaPlus, FaSpinner, FaBalanceScale } from 'react-icons/fa';

// --- BAGIAN PERBAIKAN: Definisi Konstanta untuk Menghindari Typo ---
const VIOLATION_TYPES = {
    MARKA: "UU No. 22 Thn 2009 (Melanggar Marka Jalan)",
    SABUK: "UU No. 22 Thn 2009 (Tidak Pakai Sabuk Pengaman)",
    PONSEL: "UU No. 22 Thn 2009 (Menggunakan Ponsel)",
    PROSEDUR: "PP No. 80 Thn 2012 (Melanggar Prosedur Pemeriksaan)",
    REKAMAN: "Perpol No. 2 Thn 2025 (Pelanggaran Rekaman Elektronik)",
    LAINNYA: "Lainnya"
};

// Data untuk dropdown (Menggunakan konstanta)
const violationOptions = [
    { value: VIOLATION_TYPES.MARKA, label: VIOLATION_TYPES.MARKA },
    { value: VIOLATION_TYPES.SABUK, label: VIOLATION_TYPES.SABUK },
    { value: VIOLATION_TYPES.PONSEL, label: VIOLATION_TYPES.PONSEL },
    { value: VIOLATION_TYPES.PROSEDUR, label: VIOLATION_TYPES.PROSEDUR },
    { value: VIOLATION_TYPES.REKAMAN, label: VIOLATION_TYPES.REKAMAN }, // Ini yang tadi bermasalah
    { value: VIOLATION_TYPES.LAINNYA, label: "Pelanggaran Lainnya" },
];

// Mapping Denda (Menggunakan konstanta yang sama sebagai kunci)
const violationFines = {
    [VIOLATION_TYPES.MARKA]: 500000,
    [VIOLATION_TYPES.SABUK]: 250000,
    [VIOLATION_TYPES.PONSEL]: 750000,
    [VIOLATION_TYPES.PROSEDUR]: 500000,
    [VIOLATION_TYPES.REKAMAN]: 1000000, // Pastikan nilai ini benar
    [VIOLATION_TYPES.LAINNYA]: 0
};
// ---------------------------------------------------------------------

const generateRef = () => `REF${Date.now()}`;

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
        jenisPelanggaran: '',
        denda: 0,
        lokasi: '', status: 'Belum Dikonfirmasi'
    });
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- Handler Input dengan Logika Denda Otomatis ---
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // 1. Salin state saat ini
        let updatedFormData = { ...formData };

        // 2. Update field yang sedang diketik
        if (id === 'noPolisi') {
            updatedFormData[id] = value.toUpperCase();
        } else {
            updatedFormData[id] = value;
        }

        // 3. Logika Khusus: Jika Jenis Pelanggaran berubah, update Denda
        if (id === 'jenisPelanggaran') {
            // Ambil denda dari mapping, jika tidak ada (undefined) set ke 0
            const fineAmount = violationFines[value] !== undefined ? violationFines[value] : 0;
            updatedFormData.denda = fineAmount;
        }

        // 4. Logika Khusus: Jika input manual Denda (untuk kasus "Lainnya")
        if (id === 'denda') {
            updatedFormData.denda = value === '' ? 0 : parseInt(value, 10);
        }

        // 5. Simpan state baru
        setFormData(updatedFormData);
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
            const body = new FormData();
            body.append('file', buktiFoto);
            const response = await fetch('/api/upload', { method: 'POST', body: body });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Gagal mengunggah gambar.');

            const cloudinaryUrl = data.url;
            setMessage({ type: 'info', text: 'Menyimpan data pelanggaran...' });
            const noReferensi = generateRef();

            const dataToSave = {
                ...formData,
                noReferensi,
                urlFotoBukti: cloudinaryUrl,
                tanggalPelanggaran: serverTimestamp(),
            };

            await setDoc(doc(db, 'pelanggaran', formData.noPolisi), dataToSave);

            setMessage({ type: 'success', text: `Data untuk ${formData.noPolisi} berhasil ditambahkan!` });

            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
                jenisPelanggaran: '', denda: 0, lokasi: '', status: 'Belum Dikonfirmasi'
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
                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' :
                                message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative"><FaCar className="absolute top-3.5 left-4 text-slate-400" /><input id="noPolisi" value={formData.noPolisi} onChange={handleInputChange} placeholder="No. Polisi / TNKB" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaCog className="absolute top-3.5 left-4 text-slate-400" /><input id="noRangka" value={formData.noRangka} onChange={handleInputChange} placeholder="No. Rangka" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaCog className="absolute top-3.5 left-4 text-slate-400" /><input id="noMesin" value={formData.noMesin} onChange={handleInputChange} placeholder="No. Mesin" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>
                        <div className="relative"><FaUser className="absolute top-3.5 left-4 text-slate-400" /><input id="pemilik" value={formData.pemilik} onChange={handleInputChange} placeholder="Nama Pemilik" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required /></div>

                        {/* Dropdown Jenis Pelanggaran */}
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

                        {/* Input Denda Otomatis */}
                        <div className="relative md:col-span-1">
                            <span className="absolute top-3 left-4 text-slate-500 font-bold">Rp</span>
                            <input
                                id="denda"
                                value={formData.denda} // Menampilkan angka raw agar bisa diedit jika perlu, atau gunakan .toLocaleString() di display only
                                onChange={handleInputChange}
                                placeholder="Jumlah Denda"
                                className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900 bg-slate-50"
                                // Hanya readonly jika bukan "Lainnya", jadi admin bisa edit manual kalau perlu
                                readOnly={formData.jenisPelanggaran !== VIOLATION_TYPES.LAINNYA}
                                type="number"
                            />
                        </div>

                        <div className="relative md:col-span-2">
                            <FaRoad className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="lokasi" value={formData.lokasi} onChange={handleInputChange} placeholder="Lokasi Pelanggaran" className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900" required />
                        </div>
                    </div>

                    {/* Upload Foto */}
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

                    <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-3 w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        <span>{isLoading ? 'Memproses...' : 'Simpan Data Pelanggaran'}</span>
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}