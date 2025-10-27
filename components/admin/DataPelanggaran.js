// components/admin/DataPelanggaran.js
import React from 'react';
import { FaEye } from 'react-icons/fa';

// Fungsi untuk format tanggal (aman dari error timestamp)
const formatTanggal = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return 'Invalid Date';
    }
    try {
        return timestamp.toDate().toLocaleString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
        });
    } catch (e) {
        return 'Error Formatting Date';
    }
};

// Fungsi untuk format Rupiah (aman dari error)
const formatRupiah = (number) => {
    return (number || 0).toLocaleString('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    });
};

export default function DataPelanggaran({ dataPelanggaran = [] }) {
    if (!dataPelanggaran || dataPelanggaran.length === 0) {
        return <p className="text-center text-gray-500 my-8">Belum ada data pelanggaran.</p>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow mt-6 relative"> {/* Tambah relative jika perlu */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10"> {/* Buat header sticky */}
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Polisi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemilik</th>
                        {/* --- BARU: Tambah Kolom Referensi --- */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Referensi</th>
                        {/* ---------------------------------- */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pelanggaran</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denda</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dataPelanggaran.map((pelanggaran) => (
                        <tr key={pelanggaran.noReferensi || pelanggaran.id} className="hover:bg-gray-50 transition-colors duration-150"> {/* Fallback ke ID jika noReferensi belum ada */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pelanggaran.noPolisi}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pelanggaran.pemilik}</td>
                            {/* --- BARU: Tampilkan Data Referensi --- */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pelanggaran.noReferensi}</td>
                            {/* ----------------------------------- */}
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={pelanggaran.jenisPelanggaran}>
                                {pelanggaran.jenisPelanggaran}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatTanggal(pelanggaran.tanggalPelanggaran)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pelanggaran.lokasi}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{formatRupiah(pelanggaran.denda)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pelanggaran.status === 'Belum Dikonfirmasi' ? 'bg-yellow-100 text-yellow-800' :
                                        pelanggaran.status === 'Sudah Dikonfirmasi' || pelanggaran.status === 'Menunggu Pembayaran' ? 'bg-blue-100 text-blue-800' : // Gabung status konfirmasi
                                            pelanggaran.status === 'Sudah Dibayar' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {pelanggaran.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                {pelanggaran.urlFotoBukti ? (
                                    <a href={pelanggaran.urlFotoBukti} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        <FaEye /> Lihat
                                    </a>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}