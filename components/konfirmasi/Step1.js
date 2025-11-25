// components/konfirmasi/Step1.js
import { useState } from 'react';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';

// Komponen Input dengan Validasi Visual (Dipisah agar rapi)
const ValidatedInput = ({
    id, placeholder, value, onChange, error, ...props
}) => (
    <div className="relative">
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-lg outline-none transition-colors text-gray-900
                ${error
                    ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
            required
            {...props}
        />
        {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-pulse">
                <FaExclamationCircle /> {error}
            </p>
        )}
    </div>
);

export default function Step1({ formData, setFormData, handleSubmit, isLoading, message }) {

    // State lokal untuk menyimpan pesan error
    const [errors, setErrors] = useState({});

    // Fungsi Validasi
    const validateField = (id, value) => {
        let errorMsg = '';

        if (id === 'noPolisi') {
            if (!value) errorMsg = 'Wajib diisi';
            else if (value.length < 4 || value.length > 9) errorMsg = 'Harus 4-9 Karakter';
        }

        if (id === 'noReferensi') {
            if (!value) errorMsg = 'Wajib diisi';
            // Asumsi No. Referensi minimal 5 karakter (sesuaikan jika ada aturan khusus)
            else if (value.length < 5) errorMsg = 'Minimal 5 Karakter';
        }

        setErrors(prev => ({ ...prev, [id]: errorMsg }));
        return errorMsg === '';
    };

    // Handler perubahan input
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // 1. Sanitasi Input: Huruf Besar & Angka Saja (Hapus spasi/simbol)
        const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // 2. Update State di Parent
        setFormData({ ...formData, [id]: cleanValue });

        // 3. Validasi Real-time
        validateField(id, cleanValue);
    };

    // Cek validitas seluruh form untuk tombol disable
    const isFormValid = () => {
        const isNoPolisiValid = formData.noPolisi.length >= 4 && formData.noPolisi.length <= 9;
        const isNoRefValid = formData.noReferensi.length >= 5;
        return isNoPolisiValid && isNoRefValid;
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Konfirmasi Pelanggaran</h2>
            <p className="text-slate-600 mb-6">
                Masukkan no referensi pelanggaran dan No Pol / TNKB untuk melakukan pengecekan pelanggaran yang dibebankan kepada kendaraan Anda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                {/* Input No Referensi */}
                <ValidatedInput
                    id="noReferensi"
                    placeholder="Masukkan No. Referensi"
                    value={formData.noReferensi}
                    onChange={handleInputChange}
                    error={errors.noReferensi}
                />

                {/* Input No Polisi */}
                <ValidatedInput
                    id="noPolisi"
                    placeholder="Masukkan No. Polisi (TNKB)"
                    value={formData.noPolisi}
                    onChange={handleInputChange}
                    error={errors.noPolisi}
                    maxLength={9}
                />
            </div>

            {/* Pesan Error Global (dari API/Parent) */}
            {message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
                {isLoading ? (
                    <><FaSpinner className="animate-spin" /><span>Memuat Data...</span></>
                ) : (
                    <span>Lanjut</span>
                )}
            </button>
        </form>
    );
}