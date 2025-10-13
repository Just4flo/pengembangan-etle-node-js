import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaSpinner } from 'react-icons/fa';

export default function RiwayatPembayaranPage() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllViolations = async () => {
            try {
                // 📌 1. Ambil data dari DUA koleksi secara bersamaan
                const unpaidRef = collection(db, 'pelanggaran');
                const paidRef = collection(db, 'pembayaran_berhasil');

                const [unpaidSnapshot, paidSnapshot] = await Promise.all([
                    getDocs(unpaidRef),
                    getDocs(paidRef)
                ]);

                const unpaidData = unpaidSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const paidData = paidSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 2. Gabungkan kedua data menjadi satu array
                const allViolations = [...unpaidData, ...paidData];

                // 3. Urutkan berdasarkan tanggal pelanggaran terbaru
                allViolations.sort((a, b) => b.tanggalPelanggaran.seconds - a.tanggalPelanggaran.seconds);

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
            <div className="w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    {/* Judul diubah agar lebih sesuai */}
                    <h2 className="text-3xl font-bold text-slate-800">Status Pelanggaran & Pembayaran</h2>
                    <p className="text-slate-500 mt-2">Daftar semua pelanggaran yang tercatat, baik yang sudah maupun belum dibayar.</p>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center p-12">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                        <span className="ml-4 text-slate-600">Memuat data...</span>
                    </div>
                )}

                {error && <p className="text-center text-red-600">{error}</p>}

                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No. Polisi</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Pemilik</th>
                                    {/* 📌 4. Tambahkan kolom "Status" */}
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {payments.length > 0 ? (
                                    payments.map((payment, index) => (
                                        <tr key={payment.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="py-3 px-4">{index + 1}</td>
                                            <td className="py-3 px-4 font-medium">{payment.noPolisi}</td>
                                            <td className="py-3 px-4">{payment.pemilik}</td>
                                            {/* 📌 5. Tampilkan status dengan warna */}
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'Sudah Dibayar'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {/* Tampilkan tanggal jika ada, jika tidak tampilkan strip */}
                                                {payment.tanggalPembayaran
                                                    ? new Date(payment.tanggalPembayaran.seconds * 1000).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    })
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-500">
                                            Belum ada data pelanggaran yang tercatat.
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