import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase'; // Pastikan path ini benar

// 📌 1. Impor ikon burger
import { FaTachometerAlt, FaCar, FaSignOutAlt, FaHistory, FaBars } from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 📌 2. State untuk mengontrol sidebar
    const router = useRouter();
    const currentPath = router.pathname;

    // Logika untuk memeriksa status login (tidak berubah)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/admin/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen bg-slate-100">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* 📌 3. Backdrop untuk menutup sidebar di mode HP */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full z-40 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0`}>
                <div className="p-6 text-2xl font-bold border-b border-slate-700">
                    Admin ETLE
                </div>
                <nav className="flex-grow pt-4">
                    <Link href="/admin/dashboard" className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/dashboard' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaTachometerAlt />
                        <span>Input Pelanggaran</span>
                    </Link>
                    <Link href="/admin/input-kendaraan" className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/input-kendaraan' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaCar />
                        <span>Input Kendaraan</span>
                    </Link>
                    <Link href="/admin/riwayat-pembayaran" className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/riwayat-pembayaran' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaHistory />
                        <span>Riwayat Pembayaran</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* 📌 4. Header baru yang hanya muncul di HP */}
                <header className="md:hidden bg-white shadow z-20 sticky top-0">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-800">Admin ETLE</span>
                        <button onClick={() => setIsSidebarOpen(true)} aria-label="Buka menu">
                            <FaBars className="w-6 h-6 text-slate-800" />
                        </button>
                    </div>
                </header>

                {/* Wrapper untuk konten halaman */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}