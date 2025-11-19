// pages/admin/data-kendaraan.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import TabelKendaraan from '../../components/admin/tabel-kendaraan';
import { FaSpinner, FaDatabase } from 'react-icons/fa';

export default function DataKendaraanPage() {
    const [vehicleList, setVehicleList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Referensi ke koleksi 'kendaraan'
                const vehiclesRef = collection(db, 'kendaraan');

                // 2. Mengambil data
                // Catatan: orderBy('noPolisi') mungkin memerlukan index di Firebase console
                // Untuk amannya kita ambil default dulu.
                const q = query(vehiclesRef);
                const querySnapshot = await getDocs(q);

                // 3. Mapping data dari dokumen
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Ini biasanya sama dengan No Polisi
                    ...doc.data()
                }));

                setVehicleList(data);
            } catch (err) {
                console.error("Error fetching vehicles:", err);
                setError("Gagal mengambil data dari server. Periksa koneksi internet Anda.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <AdminLayout>
            <div className="w-full mx-auto">
                {/* Header Halaman */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <FaDatabase className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Master Data Kendaraan</h1>
                            <p className="text-slate-500 text-sm">Database lengkap kendaraan yang terdaftar.</p>
                        </div>
                    </div>

                    {/* Statistik Singkat */}
                    {!isLoading && !error && (
                        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="text-sm text-slate-500">Total Kendaraan</span>
                            <span className="text-2xl font-bold text-blue-600">{vehicleList.length}</span>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
                        <span className="text-slate-600 font-medium">Menghubungkan ke database...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r text-red-700 mb-6 shadow-sm">
                        <p className="font-bold">Terjadi Kesalahan</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Data Table */}
                {!isLoading && !error && (
                    <TabelKendaraan data={vehicleList} />
                )}
            </div>
        </AdminLayout>
    );
}