// pages/admin/riwayat-pembayaran.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaSpinner, FaEye, FaDownload, FaFileImage } from 'react-icons/fa'; // Tambah FaFileImage

// Fungsi format tanggal (aman dari error timestamp)
const formatTanggal = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        try {
            return timestamp.toDate().toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
            });
        } catch (e) { console.error("Error formatting date:", e); return 'Error Format'; }
    }
    return '-';
};

// Fungsi format Rupiah (aman dari error)
const formatRupiah = (number) => {
    return (number || 0).toLocaleString('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    });
};

export default function RiwayatPembayaranPage() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllViolations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Ambil data dari DUA koleksi
                const unpaidRef = collection(db, 'pelanggaran');
                const paidRef = collection(db, 'pembayaran_berhasil');

                const [unpaidSnapshot, paidSnapshot] = await Promise.all([
                    getDocs(query(unpaidRef)),
                    getDocs(query(paidRef))
                ]);

                const unpaidData = unpaidSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const paidData = paidSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const allViolations = [...unpaidData, ...paidData];

                // Urutkan berdasarkan tanggal pelanggaran terbaru
                allViolations.sort((a, b) => (b.tanggalPelanggaran?.seconds || 0) - (a.tanggalPelanggaran?.seconds || 0));

                setPayments(allViolations);
            } catch (err) {
                console.error("Error fetching violations: ", err);
                setError("Gagal memuat data pelanggaran.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllViolations();
    }, []);

    return (
        <AdminLayout>
            <div className="w-full mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Riwayat Pelanggaran & Pembayaran</h2>
                    <p className="text-slate-500 mt-2 text-sm md:text-base">Daftar semua pelanggaran yang tercatat.</p>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center p-12">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                        <span className="ml-4 text-slate-600">Memuat data...</span>
                    </div>
                )}
                {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

                {!isLoading && !error && (
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="py-3 px-4">No</th>
                                    <th scope="col" className="py-3 px-4">No Polisi</th>
                                    <th scope="col" className="py-3 px-4">Pemilik</th>
                                    <th scope="col" className="py-3 px-4">Jenis Pelanggaran</th>
                                    <th scope="col" className="py-3 px-4">Tgl Pelanggaran</th>
                                    <th scope="col" className="py-3 px-4">Lokasi</th>
                                    <th scope="col" className="py-3 px-4">Denda</th>
                                    <th scope="col" className="py-3 px-4">Status</th>
                                    <th scope="col" className="py-3 px-4">Tgl Bayar</th>
                                    {/* DIHAPUS: Kolom Konfirmasi Pengemudi */}
                                    <th scope="col" className="py-3 px-4">Bukti Pelanggaran</th>
                                    <th scope="col" className="py-3 px-4">Bukti Bayar</th>
                                    <th scope="col" className="py-3 px-4">Aksi Download</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-900">
                                {payments.length > 0 ? (
                                    payments.map((p, index) => (
                                        <tr key={p.noReferensi || p.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{index + 1}</td>
                                            <td className="py-3 px-4 font-bold">{p.noPolisi}</td>
                                            <td className="py-3 px-4">{p.pemilik}</td>
                                            <td className="py-3 px-4 max-w-[200px] truncate" title={p.jenisPelanggaran}>{p.jenisPelanggaran}</td>
                                            <td className="py-3 px-4 whitespace-nowrap">{formatTanggal(p.tanggalPelanggaran)}</td>
                                            <td className="py-3 px-4">{p.lokasi}</td>
                                            <td className="py-3 px-4 font-semibold text-red-600">{formatRupiah(p.denda)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${p.status === 'Sudah Dibayar' ? 'bg-green-100 text-green-800' :
                                                        p.status === 'Menunggu Pembayaran' ? 'bg-blue-100 text-blue-800' :
                                                            p.status === 'Sudah Dikonfirmasi' ? 'bg-indigo-100 text-indigo-800' :
                                                                'bg-yellow-100 text-yellow-800' // Belum Dikonfirmasi
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">{formatTanggal(p.tanggalPembayaran)}</td>
                                            {/* DIHAPUS: Kolom Konfirmasi Pengemudi */}
                                            {/* Kolom Bukti Awal (Foto Pelanggaran) */}
                                            <td className="py-3 px-4">
                                                {p.urlFotoBukti ? (
                                                    <a href={p.urlFotoBukti} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                                                        <FaEye /> Lihat Awal
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            {/* BARU: Kolom Bukti Pembayaran (Link ke PNG di Cloudinary/Storage) */}
                                            <td className="py-3 px-4">
                                                {p.urlBuktiPembayaran ? ( // Cek field bukti pembayaran
                                                    <a href={p.urlBuktiPembayaran} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1 text-xs">
                                                        <FaFileImage /> Lihat Bayar
                                                    </a>
                                                ) : (p.status === 'Sudah Dibayar' ? <span className='text-xs text-gray-400'>Belum Ada</span> : '-')}
                                            </td>
                                            {/* BARU: Kolom Aksi Download Ulang */}
                                            <td className="py-3 px-4">
                                                {p.status === 'Sudah Dibayar' ? (
                                                    <a
                                                        href={`/api/bukti/${p.noPolisi}`} // Panggil API untuk download ulang
                                                        download={`Bukti_Pembayaran_ETLE_${p.noPolisi}.png`}
                                                        className="text-indigo-600 hover:underline flex items-center gap-1 text-xs"
                                                        title="Download Ulang Bukti Pembayaran (PNG)"
                                                    >
                                                        <FaDownload /> Unduh Ulang
                                                    </a>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" className="text-center py-10 text-slate-500">
                                            Belum ada data pelanggaran atau pembayaran yang tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
