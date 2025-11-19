// pages/admin/feedback.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import TabelFeedback from '../../components/admin/TabelFeedback';
import { FaSpinner, FaComments } from 'react-icons/fa';

export default function FeedbackPage() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Referensi ke koleksi 'feedback pengguna'
                const feedbackRef = collection(db, 'feedback pengguna');

                // 2. Urutkan berdasarkan waktu terbaru (descending)
                const q = query(feedbackRef, orderBy('waktuDibuat', 'desc'));
                const querySnapshot = await getDocs(q);

                // 3. Mapping data
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setFeedbackList(data);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Gagal mengambil data pesan. Pastikan koneksi internet lancar.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <AdminLayout>
            <div className="w-full mx-auto">
                {/* Header Halaman */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <FaComments className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Feedback Pengguna</h1>
                        <p className="text-slate-500 text-sm">Pesan dan masukan yang dikirim melalui formulir kontak.</p>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
                        <span className="text-slate-600 font-medium">Memuat pesan...</span>
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
                    <TabelFeedback data={feedbackList} />
                )}
            </div>
        </AdminLayout>
    );
}