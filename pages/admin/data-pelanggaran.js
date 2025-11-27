// pages/admin/data-pelanggaran.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';
import DataPelanggaran from '../../components/admin/DataPelanggaran';
import PrintModal from '../../components/admin/PrintModal';

export default function DataPelanggaranPage() {
    const [pelanggaranList, setPelanggaranList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPelanggaran, setSelectedPelanggaran] = useState(null);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const pelanggaranRef = collection(db, 'pelanggaran');
                const q = query(pelanggaranRef, orderBy('tanggalPelanggaran', 'desc'));
                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
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
    }, []);

    // Handler untuk tombol print
    const handlePrintClick = (pelanggaran) => {
        setSelectedPelanggaran(pelanggaran);
        setIsPrintModalOpen(true);
    };

    // Handler untuk tutup modal
    const handleCloseModal = () => {
        setIsPrintModalOpen(false);
        setSelectedPelanggaran(null);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data Pelanggaran Tercatat</h1>
            </div>

            {isLoading && <p className="text-center text-blue-600">Memuat data...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded">{error}</p>}

            {!isLoading && !error && (
                <DataPelanggaran
                    dataPelanggaran={pelanggaranList}
                    onPrintClick={handlePrintClick}
                />
            )}

            <PrintModal
                pelanggaran={selectedPelanggaran}
                isOpen={isPrintModalOpen}
                onClose={handleCloseModal}
            />
        </AdminLayout>
    );
}