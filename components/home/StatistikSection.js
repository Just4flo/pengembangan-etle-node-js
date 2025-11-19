// components/home/StatistikSection.js
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaChartBar, FaCarCrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function StatistikSection() {
    const [stats, setStats] = useState({
        totalPelanggaran: 0,
        sudahDibayar: 0,
        jenisTerbanyak: '-',
        totalDenda: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Ambil data dari kedua koleksi
                const pelanggaranRef = collection(db, 'pelanggaran');
                const pembayaranRef = collection(db, 'pembayaran_berhasil');

                const [snap1, snap2] = await Promise.all([
                    getDocs(pelanggaranRef),
                    getDocs(pembayaranRef)
                ]);

                // 2. Gabungkan semua data
                const data1 = snap1.docs.map(d => d.data());
                const data2 = snap2.docs.map(d => d.data());
                const allData = [...data1, ...data2];

                // 3. Hitung Statistik
                const total = allData.length;
                const dibayar = data2.length;

                // Hitung Total Denda (Estimasi dari data yang ada)
                const totalUang = allData.reduce((acc, curr) => acc + (Number(curr.denda) || 0), 0);

                // Cari Jenis Pelanggaran Terbanyak
                const jenisCount = {};
                allData.forEach(item => {
                    const jenis = item.jenisPelanggaran || 'Lainnya';
                    jenisCount[jenis] = (jenisCount[jenis] || 0) + 1;
                });

                let terbanyak = '-';
                let maxCount = 0;
                for (const [jenis, count] of Object.entries(jenisCount)) {
                    if (count > maxCount) {
                        maxCount = count;
                        terbanyak = jenis;
                    }
                }
                // Singkat nama jenis pelanggaran jika terlalu panjang
                if (terbanyak.includes('(')) {
                    terbanyak = terbanyak.split('(')[1].replace(')', '');
                }

                setStats({
                    totalPelanggaran: total,
                    sudahDibayar: dibayar,
                    jenisTerbanyak: terbanyak,
                    totalDenda: totalUang
                });

            } catch (error) {
                console.error("Gagal memuat statistik:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Format Rupiah Singkat (Jutaan/Miliar)
    const formatMoney = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' M';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + ' Jt';
        return (num / 1000).toFixed(0) + ' Rb';
    };

    return (
        <section className="py-12 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-800">
                        Statistik Penindakan <span className="text-blue-600">Jawa Barat</span>
                    </h2>
                    <p className="text-slate-500 mt-2">Data real-time penegakan hukum lalu lintas elektronik.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Pelanggaran */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4">
                            <FaCarCrash className="text-2xl" />
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {isLoading ? <span className="text-sm text-slate-400">...</span> : stats.totalPelanggaran}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Total Pelanggaran</p>
                    </div>

                    {/* Card 2: Sudah Dibayar */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-green-100 text-green-600 rounded-full mb-4">
                            <FaCheckCircle className="text-2xl" />
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {isLoading ? <span className="text-sm text-slate-400">...</span> : stats.sudahDibayar}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Kasus Selesai</p>
                    </div>

                    {/* Card 3: Jenis Terbanyak */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-orange-100 text-orange-600 rounded-full mb-4">
                            <FaExclamationTriangle className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 text-center h-10 flex items-center justify-center line-clamp-2">
                            {isLoading ? <span className="text-sm text-slate-400">...</span> : stats.jenisTerbanyak}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Pelanggaran Dominan</p>
                    </div>

                    {/* Card 4: Total Denda (Potensi PNBP) */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                            <FaChartBar className="text-2xl" />
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {isLoading ? <span className="text-sm text-slate-400">...</span> : `Rp ${formatMoney(stats.totalDenda)}`}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Potensi PNBP</p>
                    </div>
                </div>
            </div>
        </section>
    );
}