// pages/statistik/index.js

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    FaChartLine, FaCarCrash, FaMoneyBillWave,
    FaSpinner, FaChartPie
} from 'react-icons/fa';

export default function StatistikPage() {
    const [stats, setStats] = useState({
        totalPelanggaran: 0,
        sudahDibayar: 0,
        belumDibayar: 0,
        totalDendaDibayar: 0,
        topViolations: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil data dari kedua koleksi
                const unpaidRef = collection(db, 'pelanggaran');
                const paidRef = collection(db, 'pembayaran_berhasil');

                const [unpaidSnapshot, paidSnapshot] = await Promise.all([
                    getDocs(unpaidRef),
                    getDocs(paidRef)
                ]);

                const unpaidData = unpaidSnapshot.docs.map(doc => doc.data());
                const paidData = paidSnapshot.docs.map(doc => doc.data());
                const allData = [...unpaidData, ...paidData];

                // 2. Hitung Total
                const countUnpaid = unpaidData.length;
                const countPaid = paidData.length;
                const countTotal = countUnpaid + countPaid;

                // 3. Hitung Nominal Uang
                const sumPaid = paidData.reduce((acc, curr) => acc + (Number(curr.denda) || 0), 0);

                // 4. Analisis Jenis Pelanggaran
                const violationCounts = {};
                allData.forEach(item => {
                    let jenis = item.jenisPelanggaran || 'Lainnya';
                    if (jenis.includes('(')) {
                        jenis = jenis.split('(')[1].replace(')', '');
                    }
                    violationCounts[jenis] = (violationCounts[jenis] || 0) + 1;
                });

                const sortedViolations = Object.entries(violationCounts)
                    .map(([name, count]) => ({ name, count, percentage: (count / countTotal) * 100 }))
                    .sort((a, b) => b.count - a.count);

                setStats({
                    totalPelanggaran: countTotal,
                    sudahDibayar: countPaid,
                    belumDibayar: countUnpaid,
                    totalDendaDibayar: sumPaid,
                    topViolations: sortedViolations
                });

            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    // Hitung persentase tuntas
    const percentageDone = stats.totalPelanggaran > 0
        ? Math.round((stats.sudahDibayar / stats.totalPelanggaran) * 100)
        : 0;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Head>
                <title>Statistik Data Penindakan | ETLE Korlantas</title>
            </Head>

            <Navbar />

            <main className="flex-grow">
                {/* --- Header Section --- */}
                <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Data & Statistik Penindakan</h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Transparansi data penegakan hukum lalu lintas elektronik (ETLE) di wilayah hukum kami. Data diperbarui secara berkala.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 pb-12 relative z-20">

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg">
                            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
                            <span className="ml-3 text-gray-600 font-medium">Mengalkulasi data...</span>
                        </div>
                    ) : (
                        <>
                            {/* --- 1. Kartu Statistik Utama (2 Kartu) --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                {/* Total Pelanggaran */}
                                <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-blue-500 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Pelanggaran</p>
                                            <h3 className="text-4xl font-bold text-gray-800 mt-2">{stats.totalPelanggaran}</h3>
                                        </div>
                                        <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                                            <FaCarCrash className="text-2xl" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">Total kendaraan tertangkap kamera</p>
                                </div>

                                {/* Total PNBP (Pendapatan) */}
                                <div className="bg-white p-8 rounded-xl shadow-md border-b-4 border-indigo-500 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Penyetoran Kas Negara</p>
                                            <h3 className="text-3xl font-bold text-gray-800 mt-2 truncate" title={formatRupiah(stats.totalDendaDibayar)}>
                                                {formatRupiah(stats.totalDendaDibayar)}
                                            </h3>
                                        </div>
                                        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
                                            <FaMoneyBillWave className="text-2xl" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">Total denda yang telah dibayarkan</p>
                                </div>
                            </div>

                            {/* --- 2. Detail & Grafik --- */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Grafik Batang Jenis Pelanggaran */}
                                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FaChartLine className="text-blue-600 text-xl" />
                                        <h3 className="text-xl font-bold text-gray-800">Jenis Pelanggaran Terbanyak</h3>
                                    </div>

                                    <div className="space-y-5">
                                        {stats.topViolations.length > 0 ? (
                                            stats.topViolations.map((item, index) => (
                                                <div key={index}>
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                                        <span className="text-sm font-bold text-gray-900">{item.count} Kasus</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full ${index === 0 ? 'bg-red-500' :
                                                                    index === 1 ? 'bg-orange-500' :
                                                                        index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                                                                }`}
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-10">Belum ada data pelanggaran yang cukup.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Ringkasan Persentase (Rasio Tuntas) */}
                                <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center">
                                    <div className="flex items-center gap-3 mb-8 w-full">
                                        <FaChartPie className="text-purple-600 text-xl" />
                                        <h3 className="text-xl font-bold text-gray-800">Rasio Penyelesaian</h3>
                                    </div>

                                    <div className="relative w-56 h-56 rounded-full bg-gray-100 flex items-center justify-center shadow-inner"
                                        style={{
                                            // Warna hijau (tuntas) vs oranye (sisa)
                                            background: `conic-gradient(#10b981 0% ${percentageDone}%, #f97316 ${percentageDone}% 100%)`
                                        }}
                                    >
                                        <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                                            <span className="text-5xl font-extrabold text-slate-800">
                                                {percentageDone}%
                                            </span>
                                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2">
                                                Tuntas
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-center text-gray-400 text-sm mt-8">
                                        Persentase pelanggaran yang telah diselesaikan pembayarannya.
                                    </p>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
