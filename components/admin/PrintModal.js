// components/admin/PrintModal.js
import { FaPrint, FaInfoCircle } from 'react-icons/fa';
import { generateSuratTilang } from '../../utils/pdfGenerator';

const PrintModal = ({ pelanggaran, isOpen, onClose }) => {
    if (!isOpen || !pelanggaran) return null;

    // Format Rupiah untuk display
    const formatRupiah = (number) => {
        return (number || 0).toLocaleString('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        });
    };

    // Format tanggal untuk display
    const formatTanggal = (timestamp) => {
        if (!timestamp || typeof timestamp.toDate !== 'function') {
            return 'Invalid Date';
        }
        try {
            return timestamp.toDate().toLocaleString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
            });
        } catch (e) {
            return 'Error Formatting Date';
        }
    };

    // Fungsi untuk handle print
    const handlePrint = async () => {
        try {
            const pdfDoc = await generateSuratTilang(pelanggaran);
            const fileName = `surat-tilang-${pelanggaran.noPolisi}-${pelanggaran.noReferensi || pelanggaran.id}.pdf`;
            pdfDoc.save(fileName);
            onClose();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Gagal membuat surat tilang. Silakan coba lagi.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                    <FaInfoCircle className="text-blue-600" />
                    Preview Surat Tilang - {pelanggaran.noPolisi}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Data Utama */}
                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                        <h4 className="font-bold mb-3 text-gray-900">DATA UTAMA</h4>
                        <div className="space-y-2 text-sm text-gray-800">
                            <p><strong className="text-gray-900">No. Polisi:</strong> <span className="text-gray-800">{pelanggaran.noPolisi}</span></p>
                            <p><strong className="text-gray-900">Pemilik:</strong> <span className="text-gray-800">{pelanggaran.pemilik}</span></p>
                            <p><strong className="text-gray-900">No. Referensi:</strong> <span className="text-gray-800">{pelanggaran.noReferensi}</span></p>
                            <p><strong className="text-gray-900">Jenis Pelanggaran:</strong> <span className="text-gray-800">{pelanggaran.jenisPelanggaran}</span></p>
                            <p><strong className="text-gray-900">Lokasi:</strong> <span className="text-gray-800">{pelanggaran.lokasi}</span></p>
                            <p><strong className="text-gray-900">Denda:</strong> <span className="text-red-600 font-bold">{formatRupiah(pelanggaran.denda)}</span></p>
                            <p><strong className="text-gray-900">Status:</strong>
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${pelanggaran.status === 'Belum Dikonfirmasi' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                        pelanggaran.status === 'Sudah Dikonfirmasi' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                            'bg-green-100 text-green-800 border border-green-300'
                                    }`}>
                                    {pelanggaran.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Data Kendaraan & Waktu */}
                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                        <h4 className="font-bold mb-3 text-gray-900">DATA KENDARAAN & WAKTU</h4>
                        <div className="space-y-2 text-sm text-gray-800">
                            <p><strong className="text-gray-900">Tanggal Pelanggaran:</strong> <span className="text-gray-800">{formatTanggal(pelanggaran.tanggalPelanggaran)}</span></p>
                            <p><strong className="text-gray-900">No. Mesin:</strong> <span className="text-gray-800">{pelanggaran.noMesin || 'Tidak tersedia'}</span></p>
                            <p><strong className="text-gray-900">No. Rangka:</strong> <span className="text-gray-800">{pelanggaran.noRangka || 'Tidak tersedia'}</span></p>
                        </div>
                    </div>
                </div>

                {/* Preview Gambar */}
                {pelanggaran.urlFotoBukti && (
                    <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                        <h4 className="font-bold mb-3 text-gray-900">BUKTI FOTO PELANGGARAN</h4>
                        <div className="flex justify-center">
                            <img
                                src={pelanggaran.urlFotoBukti}
                                alt="Bukti pelanggaran"
                                className="max-w-full h-48 object-contain rounded border-2 border-gray-300"
                            />
                        </div>
                        <p className="text-xs text-gray-600 text-center mt-2">
                            Gambar ini akan ditampilkan dalam surat tilang PDF
                        </p>
                    </div>
                )}

                {/* Informasi PDF */}
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-gray-800">
                        <strong className="text-gray-900">Informasi:</strong> PDF yang dihasilkan akan berisi semua data di atas beserta gambar bukti pelanggaran.
                        Teks dalam PDF akan berwarna hitam untuk keterbacaan yang optimal.
                    </p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
                    >
                        <FaPrint />
                        Generate PDF
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintModal;