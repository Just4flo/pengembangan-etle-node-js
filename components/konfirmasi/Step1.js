// components/konfirmasi/Step1.js
import { FaSpinner } from 'react-icons/fa';

export default function Step1({ formData, setFormData, handleSubmit, isLoading, message }) {
    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Konfirmasi Pelanggaran</h2>
            <p className="text-slate-600 mb-6">Masukkan no referensi pelanggaran dan No Pol / TNKB untuk melakukan pengecekan pelanggaran yang dibebankan kepada kendaraan anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Masukkan no referensi"
                    value={formData.noReferensi}
                    onChange={(e) => setFormData({ ...formData, noReferensi: e.target.value })}
                    // *** KODE PERUBAHAN WARNA TEKS INPUT ***
                    className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                />
                <input
                    type="text"
                    placeholder="Masukkan nomor polisi (TNKB)"
                    value={formData.noPolisi}
                    onChange={(e) => setFormData({ ...formData, noPolisi: e.target.value.toUpperCase() })}
                    // *** KODE PERUBAHAN WARNA TEKS INPUT ***
                    className="p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase text-gray-900"
                    required
                />
            </div>

            {message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2">
                {isLoading ? (<><FaSpinner className="animate-spin" /><span>Memuat Data...</span></>) : (<span>Lanjut</span>)}
            </button>
        </form>
    );
}