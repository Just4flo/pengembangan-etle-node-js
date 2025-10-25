// components/konfirmasi/Step4.js
export default function Step4({ setCurrentStep, violationData, confirmationData, handleFinalSubmit }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Ringkasan & Penerbitan BRIVA</h2>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 mb-6">
                <h3 className="font-bold text-blue-800">VERIFIKASI AKHIR</h3>
                <p className="text-sm text-slate-600 mt-2">Pastikan semua data sudah benar sebelum menerbitkan kode pembayaran BRIVA.</p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-gray-900">
                    <h4 className="font-bold border-b pb-2 mb-2">Data Pelanggaran</h4>
                    <p><strong>No. Polisi:</strong> {violationData.noPolisi}</p>
                    <p><strong>Jenis Pelanggaran:</strong> {violationData.jenisPelanggaran}</p>
                    <p><strong>Denda:</strong> <span className="text-red-600 font-bold">Rp{violationData.denda?.toLocaleString('id-ID')}</span></p>
                </div>

                {confirmationData?.statusKendaraan === 'milik-sendiri' && (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-900">
                        <h4 className="font-bold border-b pb-2 mb-2">Data Pengemudi Dikonfirmasi</h4>
                        <p><strong>Nama:</strong> {confirmationData.pengemudi.namaPengemudi}</p>
                        <p><strong>No. SIM:</strong> {confirmationData.pengemudi.noSim}</p>
                    </div>
                )}
                {confirmationData?.statusKendaraan === 'sudah-dijual' && (
                    <div className="bg-red-50 p-4 rounded-lg text-gray-900">
                        <p className="text-red-700">Anda mengkonfirmasi kendaraan **SUDAH DIJUAL**. Data ini akan diproses untuk tindak lanjut.</p>
                    </div>
                )}
            </div>

            <button onClick={handleFinalSubmit} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700">
                Terbitkan Kode Pembayaran & Lanjut
            </button>
            <button onClick={() => setCurrentStep(3)} className="ml-4 text-sm text-gray-600 hover:text-gray-800">
                Kembali
            </button>
        </div>
    );
}