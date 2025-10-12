export default function Step2({ violationData, setCurrentStep }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Data tidak tersedia';
        return new Date(timestamp.seconds * 1000).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    };
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Status Pelanggaran</h3>
            <p className="text-slate-500 mt-1 mb-6">Data pelanggaran ditemukan. Mohon periksa detail dan bukti foto di bawah ini.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Bukti Pelanggaran</h4>
                    <img src={violationData.urlFotoBukti} alt={`Pelanggaran ${violationData.jenisPelanggaran}`} className="w-full rounded-lg shadow-md border" />
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold text-slate-800 mb-3">Detail Data</h4>
                    <div className="space-y-2 text-sm text-slate-800">
                        <p><strong>No. Referensi:</strong> {violationData.noReferensi}</p>
                        <p><strong>No. Polisi:</strong> {violationData.noPolisi}</p>
                        <p><strong>Jenis Pelanggaran:</strong> {violationData.jenisPelanggaran}</p>
                        <p><strong>Tanggal:</strong> {formatDate(violationData.tanggalPelanggaran)}</p>
                        <p><strong>Lokasi:</strong> {violationData.lokasi}</p>
                        <p><strong>Status:</strong> <span className="font-semibold text-red-600">{violationData.status}</span></p>
                    </div>
                </div>
            </div>
            <button onClick={() => setCurrentStep(3)} className="mt-8 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Lanjut ke Konfirmasi Kendaraan</button>
        </div>
    );
}