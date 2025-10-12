export default function Step1({ formData, setFormData, handleSubmit, isLoading, message }) {
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Konfirmasi Pelanggaran</h3>
            <p className="text-gray-500 mt-1 mb-6">
                Masukkan no referensi pelanggaran dan No Pol / TNKB untuk melakukan pengecekan pelanggaran yang dibebankan kepada kendaraan anda.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={formData.noReferensi} onChange={(e) => setFormData({ ...formData, noReferensi: e.target.value })} placeholder="Masukan nomor referensi" className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" required />
                    <input type="text" value={formData.noPolisi} onChange={(e) => setFormData({ ...formData, noPolisi: e.target.value.toUpperCase() })} placeholder="Masukan nomor polisi" className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" required />
                </div>
                {message && <p className="text-sm text-red-600">{message}</p>}
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isLoading ? 'Mencari...' : 'Lanjut'}</button>
            </form>
        </div>
    );
}