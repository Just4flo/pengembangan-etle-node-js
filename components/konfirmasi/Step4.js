export default function Step4({ setCurrentStep, violationData, confirmationData, handleFinalSubmit }) {
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Ringkasan Konfirmasi</h3>
            <p className="text-slate-500 mt-1 mb-6">Mohon periksa kembali semua data sebelum menyelesaikan proses konfirmasi.</p>
            <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold text-slate-800 mb-3">Detail Pelanggaran</h4>
                    <div className="text-sm text-slate-800 space-y-1">
                        <p><strong>No. Polisi:</strong> {violationData.noPolisi}</p>
                        <p><strong>Jenis Pelanggaran:</strong> {violationData.jenisPelanggaran}</p>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold text-slate-800 mb-3">Konfirmasi Pengemudi</h4>
                    <div className="text-sm text-slate-800">
                        {confirmationData.driverType === 'pemilik' ? (<p>Pelanggaran dikonfirmasi oleh <strong>Pemilik Kendaraan</strong>.</p>) : (<p>Pelanggaran dikonfirmasi oleh: <strong>{confirmationData.otherDriverName}</strong>.</p>)}
                    </div>
                </div>
            </div>
            <button onClick={handleFinalSubmit} className="mt-8 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Konfirmasi & Dapatkan Kode Pembayaran</button>
        </div>
    );
}