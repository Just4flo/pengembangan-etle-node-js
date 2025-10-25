// components/konfirmasi/Step2.js
import Image from 'next/image';

// HAPUS FUNGSI parseComplexDate dan monthMap (TIDAK DIPERLUKAN)

export default function Step2({ violationData, setCurrentStep }) {
    if (!violationData) {
        return <p className="text-red-500">Data pelanggaran tidak ditemukan. Kembali ke Langkah 1.</p>;
    }

    let tanggalPelanggaranFormatted = 'Format Tanggal Tidak Valid';

    // --- PERBAIKAN LOGIKA UTAMA (KONVERSI TIMESTAMP) ---
    if (violationData.tanggalPelanggaran) {
        try {
            // Cek apakah 'tanggalPelanggaran' adalah objek dan memiliki fungsi .toDate()
            if (typeof violationData.tanggalPelanggaran.toDate === 'function') {

                // 1. Konversi Firebase Timestamp ke JavaScript Date object
                const dateObj = violationData.tanggalPelanggaran.toDate();

                // 2. Format tanggal tersebut
                tanggalPelanggaranFormatted = dateObj.toLocaleString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    timeZone: 'Asia/Jakarta' // Pastikan zona waktu WIB
                });

            } else {
                // Fallback jika ternyata datanya string (seperti percobaan sebelumnya)
                const dateObj = new Date(violationData.tanggalPelanggaran.toString().replace(' at ', ' ').replace(' UTC+7', ''));
                if (!isNaN(dateObj.getTime())) {
                    tanggalPelanggaranFormatted = dateObj.toLocaleString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                    });
                }
            }
        } catch (e) {
            tanggalPelanggaranFormatted = 'Error Pemrosesan Tanggal';
        }
    }
    // ------------------------------------

    // Helper function untuk rendering baris data
    const DetailRow = ({ label, value, isBold = false }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100">
            <span className="font-medium text-gray-700 w-2/5">{label}:</span>
            <span className={`text-right w-3/5 ${isBold ? 'font-bold text-gray-900' : 'text-gray-900'}`}>{value}</span>
        </div>
    );

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Status Pelanggaran</h2>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 mb-6">
                <h3 className="text-lg font-bold text-yellow-800">DETAIL PELANGGARAN</h3>
                <p className="text-sm text-slate-600 mt-2">Harap verifikasi detail di bawah ini sebelum melanjutkan.</p>
            </div>

            {/* Bagian Gambar Bukti Pelanggaran */}
            {violationData.urlFotoBukti && (
                <div className="mb-6 p-4 border rounded-lg bg-white shadow-md text-center">
                    <h4 className="font-bold text-red-600 mb-3">BUKTI PELANGGARAN</h4>
                    <div className="relative w-full h-64 mx-auto overflow-hidden rounded-lg">
                        <Image
                            src={violationData.urlFotoBukti}
                            alt={`Bukti Pelanggaran ${violationData.noPolisi}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition duration-300 hover:scale-105"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Tampilan bukti pelanggaran yang terekam kamera ETLE.</p>
                </div>
            )}

            {/* Bagian Detail Data yang Diminta */}
            <div className="space-y-1 mb-8 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Informasi Tilang</h4>

                <DetailRow label="No. Referensi" value={violationData.noReferensi} isBold={true} />
                <DetailRow label="Tgl. & Waktu Pelanggaran" value={tanggalPelanggaranFormatted} />
                <DetailRow label="Lokasi Kejadian" value={violationData.lokasi} />
                <DetailRow label="Jenis Pelanggaran" value={violationData.jenisPelanggaran} isBold={true} />
                <DetailRow label="Status" value={violationData.status} />
                <DetailRow label="Pemilik Terdaftar" value={violationData.pemilik} />
            </div>

            {/* Tombol Lanjut ke Step 3 */}
            <button onClick={() => setCurrentStep(3)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
                Lanjut ke Konfirmasi Kendaraan
            </button>
        </div>
    );
}