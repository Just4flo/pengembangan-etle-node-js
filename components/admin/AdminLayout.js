import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase'; // Pastikan path ini benar

// 📌 PERBAIKAN DI SINI: FaHistory ditambahkan ke dalam impor
import { FaTachometerAlt, FaCar, FaSignOutAlt, FaHistory } from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const currentPath = router.pathname;

    // Logika untuk memeriksa status login
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Pengguna sudah login
            } else {
                router.push('/admin/login'); // Arahkan ke halaman login jika belum
            }
        });
        // Berhenti memantau saat komponen di-unmount
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    // Tampilkan loading screen sampai status login terverifikasi
    if (!user) {
        return <div className="flex items-center justify-center h-screen bg-slate-100">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-slate-700">
                    Admin ETLE
                </div>
                <nav className="flex-grow pt-4">
                    <Link href="/admin/dashboard"
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/dashboard'
                                ? 'bg-blue-800 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}>
                        <FaTachometerAlt />
                        <span>Input Pelanggaran</span>
                    </Link>
                    <Link href="/admin/input-kendaraan"
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/input-kendaraan'
                                ? 'bg-blue-800 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}>
                        <FaCar />
                        <span>Input Kendaraan</span>
                    </Link>
                    <Link href="/admin/riwayat-pembayaran"
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/riwayat-pembayaran'
                                ? 'bg-blue-800 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}>
                        <FaHistory />
                        <span>Riwayat Pembayaran</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}