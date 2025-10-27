// pages/admin/data-pelanggaran.js (Contoh)
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Pastikan path benar
import AdminLayout from '../../components/admin/AdminLayout';
import DataPelanggaran from '../../components/admin/DataPelanggaran'; // Import komponen tabel

export default function DataPelanggaranPage() {
    const [pelanggaranList, setPelanggaranList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Mengambil data dari koleksi 'pelanggaran', diurutkan berdasarkan tanggal (terbaru dulu)
                const pelanggaranRef = collection(db, 'pelanggaran');
                const q = query(pelanggaranRef, orderBy('tanggalPelanggaran', 'desc')); // Urutkan descending
                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map(doc => ({
                    // id: doc.id, // Jika Anda perlu ID dokumen
                    ...doc.data()
                }));
                setPelanggaranList(data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Gagal memuat data pelanggaran.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Efek hanya berjalan sekali saat komponen dimuat

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Data Pelanggaran Tercatat</h1>

            {isLoading && <p className="text-center text-blue-600">Memuat data...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded">{error}</p>}

            {/* Tampilkan tabel jika data ada dan tidak loading */}
            {!isLoading && !error && (
                <DataPelanggaran dataPelanggaran={pelanggaranList} />
            )}
        </AdminLayout>
    );
}