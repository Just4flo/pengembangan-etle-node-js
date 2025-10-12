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
        const fetchPayments = async () => {
            try {
                // Buat query untuk mengambil semua data dari 'pembayaran_berhasil'
                // dan urutkan berdasarkan tanggal pembayaran terbaru
                const paymentsRef = collection(db, 'pembayaran_berhasil');
                const q = query(paymentsRef, orderBy('tanggalPembayaran', 'desc'));

                const querySnapshot = await getDocs(q);

                const paymentsData = querySnapshot.docs.map(doc => ({
                    id: doc.id, // ID dokumen (No. Polisi)
                    ...doc.data()
                }));

                setPayments(paymentsData);
            } catch (err) {
                console.error("Error fetching payment history: ", err);
                setError("Gagal memuat data riwayat pembayaran.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, []); // Dijalankan hanya sekali saat komponen dimuat

    return (
        <AdminLayout>
            <div className="w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Riwayat Pembayaran Berhasil</h2>
                    <p className="text-slate-500 mt-2">Daftar semua pelanggaran yang telah lunas dibayar.</p>
                </div>

                {/* Tampilan Loading */}
                {isLoading && (
                    <div className="flex justify-center items-center p-12">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                        <span className="ml-4 text-slate-600">Memuat data...</span>
                    </div>
                )}

                {/* Tampilan Error */}
                {error && <p className="text-center text-red-600">{error}</p>}

                {/* Tampilan Tabel Jika Data Ada */}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No. Polisi</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Pemilik</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Jenis Pelanggaran</th>
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
                                            <td className="py-3 px-4">{payment.jenisPelanggaran}</td>
                                            <td className="py-3 px-4 text-sm">
                                                {new Date(payment.tanggalPembayaran.seconds * 1000).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-500">
                                            Belum ada data pembayaran yang tersimpan.
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