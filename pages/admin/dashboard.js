// pages/admin/dashboard.js
import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    FaCar, FaCog, FaUser, FaRoad, FaFileUpload, FaPlus,
    FaSpinner, FaBalanceScale, FaExclamationTriangle, FaCheck
} from 'react-icons/fa';

// --- KONSTANTA ---
const VIOLATION_TYPES = {
    MARKA: "UU No. 22 Thn 2009 (Melanggar Marka Jalan)",
    SABUK: "UU No. 22 Thn 2009 (Tidak Pakai Sabuk Pengaman)",
    PONSEL: "UU No. 22 Thn 2009 (Menggunakan Ponsel)",
    PROSEDUR: "PP No. 80 Thn 2012 (Melanggar Prosedur Pemeriksaan)",
    REKAMAN: "Perpol No. 2 Thn 2025 (Pelanggaran Rekaman Elektronik)",
    LAINNYA: "Lainnya"
};

const violationOptions = [
    { value: VIOLATION_TYPES.MARKA, label: VIOLATION_TYPES.MARKA },
    { value: VIOLATION_TYPES.SABUK, label: VIOLATION_TYPES.SABUK },
    { value: VIOLATION_TYPES.PONSEL, label: VIOLATION_TYPES.PONSEL },
    { value: VIOLATION_TYPES.PROSEDUR, label: VIOLATION_TYPES.PROSEDUR },
    { value: VIOLATION_TYPES.REKAMAN, label: VIOLATION_TYPES.REKAMAN },
    { value: VIOLATION_TYPES.LAINNYA, label: "Pelanggaran Lainnya" },
];

const violationFines = {
    [VIOLATION_TYPES.MARKA]: 500000,
    [VIOLATION_TYPES.SABUK]: 250000,
    [VIOLATION_TYPES.PONSEL]: 750000,
    [VIOLATION_TYPES.PROSEDUR]: 500000,
    [VIOLATION_TYPES.REKAMAN]: 1000000,
    [VIOLATION_TYPES.LAINNYA]: 0
};

const generateRef = () => `REF${Date.now()}`;

// --- KOMPONEN INPUT DENGAN VALIDASI VISUAL ---
const InputGroup = ({ icon: Icon, id, placeholder, value, error, onChange, maxLength, minLength, ...props }) => {
    // Hitung progress untuk visual feedback
    const getInputStatus = () => {
        if (!value) return 'empty';

        if (minLength && maxLength) {
            if (value.length < minLength) return 'too-short';
            if (value.length > maxLength) return 'too-long';
            if (value.length >= minLength && value.length <= maxLength) return 'perfect';
        }

        if (maxLength && value.length === maxLength) return 'perfect';
        if (minLength && value.length >= minLength) return 'good';

        return 'typing';
    };

    const status = getInputStatus();

    const getBorderColor = () => {
        switch (status) {
            case 'too-short': return 'border-orange-500 bg-orange-50';
            case 'too-long': return 'border-red-500 bg-red-50';
            case 'perfect': return 'border-green-500 bg-green-50';
            case 'good': return 'border-blue-500 bg-blue-50';
            case 'empty': return 'border-slate-300';
            default: return 'border-slate-300';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'perfect': return <FaCheck className="text-green-500 text-sm" />;
            case 'too-short': return <FaExclamationTriangle className="text-orange-500 text-sm" />;
            case 'too-long': return <FaExclamationTriangle className="text-red-500 text-sm" />;
            default: return null;
        }
    };

    const getStatusMessage = () => {
        if (!value) return null;

        switch (status) {
            case 'too-short':
                return `Terlalu pendek (min ${minLength} karakter)`;
            case 'too-long':
                return `Terlalu panjang (max ${maxLength} karakter)`;

            default:
                return null;
        }
    };

    return (
        <div className="relative">
            <Icon className="absolute top-3.5 left-4 text-slate-400" />
            <input
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-3 pl-12 pr-10 border rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${error ? 'border-red-500 bg-red-50' : getBorderColor()
                    }`}
                required
                maxLength={maxLength}
                {...props}
            />

            {/* Status Icon */}
            <div className="absolute top-3.5 right-3">
                {getStatusIcon()}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FaExclamationTriangle /> {error}
                </p>
            )}

            {/* Status Message */}
            {!error && getStatusMessage() && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${status === 'perfect' ? 'text-green-600' :
                        status === 'too-short' ? 'text-orange-600' :
                            status === 'too-long' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                    {getStatusMessage()}
                </p>
            )}

            {/* Character Counter */}
            {maxLength && value && (
                <div className="text-right">
                    <span className={`text-xs ${value.length > maxLength ? 'text-red-600 font-bold' :
                            value.length === maxLength ? 'text-green-600 font-bold' : 'text-slate-500'
                        }`}>
                        {value.length}/{maxLength}
                    </span>
                </div>
            )}
        </div>
    );
};

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
        jenisPelanggaran: '', denda: 0, lokasi: '', status: 'Belum Dikonfirmasi'
    });
    const [buktiFoto, setBuktiFoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // State Error
    const [errors, setErrors] = useState({});

    // --- VALIDASI ---
    const validateField = (id, value) => {
        let error = "";
        switch (id) {
            case 'noPolisi':
                if (!value) error = "No. Polisi wajib diisi";
                else if (value.length < 4 || value.length > 9) error = "Panjang harus 4-9 karakter";
                break;
            case 'noRangka':
                if (!value) error = "No. Rangka wajib diisi";
                else if (value.length !== 17) error = "Harus tepat 17 karakter";
                break;
            case 'noMesin':
                if (!value) error = "No. Mesin wajib diisi";
                else if (value.length < 10 || value.length > 14) error = "Panjang harus 10-14 karakter";
                break;
            case 'pemilik':
                if (!value) error = "Nama Pemilik wajib diisi";
                else if (value.length < 2) error = "Nama terlalu pendek";
                break;
            case 'lokasi':
                if (!value) error = "Lokasi wajib diisi";
                else if (value.length < 5) error = "Lokasi terlalu pendek";
                break;
            case 'jenisPelanggaran':
                if (!value) error = "Pilih jenis pelanggaran";
                break;
            default:
                break;
        }
        return error;
    };

    // Cek apakah form valid keseluruhan
    const isFormValid = () => {
        // Cek apakah ada error message
        const hasErrors = Object.values(errors).some(err => err !== "");

        // Cek apakah ada field kosong
        const hasEmptyFields = !formData.noPolisi || !formData.noRangka || !formData.noMesin ||
            !formData.pemilik || !formData.lokasi || !formData.jenisPelanggaran || !buktiFoto;

        return !hasErrors && !hasEmptyFields;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        let updatedFormData = { ...formData };
        let processedValue = value;

        // Format input (Uppercase & Alphanumeric only)
        if (['noPolisi', 'noRangka', 'noMesin'].includes(id)) {
            processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        }

        updatedFormData[id] = processedValue;

        // Validasi Real-time
        const error = validateField(id, processedValue);
        setErrors(prev => ({ ...prev, [id]: error }));

        // Logika Denda Otomatis
        if (id === 'jenisPelanggaran') {
            const fineAmount = violationFines[value] !== undefined ? violationFines[value] : 0;
            updatedFormData.denda = fineAmount;
        }

        // Logika Denda Manual (jika diedit)
        if (id === 'denda') {
            updatedFormData.denda = value === '' ? 0 : parseInt(value, 10);
        }

        setFormData(updatedFormData);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBuktiFoto(e.target.files[0]);
            setErrors(prev => ({ ...prev, buktiFoto: "" })); // Hapus error foto
        } else {
            setBuktiFoto(null);
            setErrors(prev => ({ ...prev, buktiFoto: "Foto bukti wajib diunggah" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            setMessage({ type: 'error', text: 'Harap lengkapi semua data dengan benar.' });
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

            // Reset Form
            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', pemilik: '',
                jenisPelanggaran: '', denda: 0, lokasi: '', status: 'Belum Dikonfirmasi'
            });
            setBuktiFoto(null);
            setErrors({});
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
                        {/* No Polisi - 4-9 karakter */}
                        <InputGroup
                            icon={FaCar}
                            id="noPolisi"
                            value={formData.noPolisi}
                            onChange={handleInputChange}
                            placeholder="No. Polisi / TNKB"
                            error={errors.noPolisi}
                            minLength={4}
                            maxLength={9}
                        />

                        {/* No Rangka - tepat 17 karakter */}
                        <InputGroup
                            icon={FaCog}
                            id="noRangka"
                            value={formData.noRangka}
                            onChange={handleInputChange}
                            placeholder="No. Rangka"
                            error={errors.noRangka}
                            minLength={17}
                            maxLength={17}
                        />

                        {/* No Mesin - 10-14 karakter */}
                        <InputGroup
                            icon={FaCog}
                            id="noMesin"
                            value={formData.noMesin}
                            onChange={handleInputChange}
                            placeholder="No. Mesin"
                            error={errors.noMesin}
                            minLength={10}
                            maxLength={14}
                        />

                        {/* Nama Pemilik */}
                        <InputGroup
                            icon={FaUser}
                            id="pemilik"
                            value={formData.pemilik}
                            onChange={handleInputChange}
                            placeholder="Nama Pemilik"
                            error={errors.pemilik}
                            minLength={2}
                        />

                        {/* Jenis Pelanggaran */}
                        <div className="relative md:col-span-1">
                            <FaBalanceScale className="absolute top-3.5 left-4 text-slate-400" />
                            <select
                                id="jenisPelanggaran"
                                value={formData.jenisPelanggaran}
                                onChange={handleInputChange}
                                className={`w-full p-3 pl-12 border rounded-lg text-slate-900 bg-white outline-none transition-colors ${errors.jenisPelanggaran ? 'border-red-500 bg-red-50' :
                                        formData.jenisPelanggaran ? 'border-green-500 bg-green-50' : 'border-slate-300'
                                    }`}
                                required
                            >
                                <option value="" disabled>Pilih Jenis Pelanggaran</option>
                                {violationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {formData.jenisPelanggaran && (
                                <FaCheck className="absolute top-3.5 right-3 text-green-500 text-sm" />
                            )}
                            {errors.jenisPelanggaran && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <FaExclamationTriangle /> {errors.jenisPelanggaran}
                                </p>
                            )}
                        </div>

                        {/* Denda */}
                        <div className="relative md:col-span-1">
                            <span className="absolute top-3 left-4 text-slate-500 font-bold">Rp</span>
                            <input
                                id="denda"
                                value={formData.denda}
                                onChange={handleInputChange}
                                placeholder="Jumlah Denda"
                                className="w-full p-3 pl-12 border border-slate-300 rounded-lg text-slate-900 bg-slate-50"
                                readOnly={formData.jenisPelanggaran !== VIOLATION_TYPES.LAINNYA}
                                type="number"
                            />
                        </div>

                        {/* Lokasi */}
                        <div className="relative md:col-span-2">
                            <InputGroup
                                icon={FaRoad}
                                id="lokasi"
                                value={formData.lokasi}
                                onChange={handleInputChange}
                                placeholder="Lokasi Pelanggaran"
                                error={errors.lokasi}
                                minLength={5}
                            />
                        </div>
                    </div>

                    {/* Upload Foto */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Foto Bukti Pelanggaran</label>
                        <div className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${!buktiFoto && errors.buktiFoto ? 'border-red-500 bg-red-50' :
                                buktiFoto ? 'border-green-500 bg-green-50' : 'border-slate-300'
                            }`}>
                            <div className="text-center">
                                <FaFileUpload className={`mx-auto h-12 w-12 ${!buktiFoto && errors.buktiFoto ? 'text-red-400' :
                                        buktiFoto ? 'text-green-400' : 'text-slate-300'
                                    }`} />
                                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500">
                                        <span>Unggah file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                    </label>
                                    <p className="pl-1">atau seret dan lepas</p>
                                </div>
                                {buktiFoto ? (
                                    <p className="text-sm text-green-600 font-semibold mt-2 flex items-center justify-center gap-2">
                                        <FaCheck /> {buktiFoto.name}
                                    </p>
                                ) : (
                                    errors.buktiFoto && <p className="text-xs text-red-500 mt-2">{errors.buktiFoto}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid()}
                        className="flex items-center justify-center gap-3 w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        <span>{isLoading ? 'Memproses...' : 'Simpan Data Pelanggaran'}</span>
                    </button>

                    {!isFormValid() && (
                        <div className="text-center text-xs text-orange-600 mt-2">
                            * Harap lengkapi semua data dengan benar sebelum menyimpan.
                        </div>
                    )}
                </form>
            </div>
        </AdminLayout>
    );
}