// components/admin/AdminLayout.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// 📌 Pastikan path ini 100% benar relatif terhadap file AdminLayout.js
import { auth } from '../../config/firebase';
// Impor ikon yang diperlukan
import {
    FaTachometerAlt, // Dashboard / Input Pelanggaran
    FaCar,           // Input Kendaraan
    FaSignOutAlt,    // Logout
    FaHistory,       // Riwayat
    FaBars,          // Menu Mobile
    FaTimes,         // Close Menu
    FaList,          // Data Pelanggaran
    FaDatabase,
    FaComments      // Data Kendaraan (Master Data)
} from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const currentPath = router.pathname;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Pengalihan hanya jika BUKAN di halaman login itu sendiri
                if (router.pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        // Tutup sidebar sebelum logout (jika terbuka di mobile)
        setIsSidebarOpen(false);
        try {
            await signOut(auth);
            router.push('/'); // Arahkan ke halaman utama setelah logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Fungsi untuk menutup sidebar (misalnya saat link diklik)
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Tampilkan loading jika user belum terautentikasi (kecuali di halaman login)
    if (!user && router.pathname !== '/admin/login') {
        return <div className="flex items-center justify-center h-screen bg-slate-100">Memuat Sesi Admin...</div>;
    }

    // Jangan tampilkan layout jika di halaman login
    if (router.pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Helper untuk class link aktif
    const getLinkClass = (path) => {
        return `flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === path ? 'bg-blue-800 border-r-4 border-blue-400' : 'hover:bg-slate-700'
            }`;
    };

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* Backdrop (Mobile Only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar */}
            <aside
                id="admin-sidebar"
                className={`fixed top-0 left-0 h-full z-40 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 md:flex-shrink-0 shadow-xl`}
                aria-label="Menu Admin"
            >
                {/* Sidebar Header */}
                <div className="p-5 text-2xl font-bold border-b border-slate-700 flex justify-between items-center bg-slate-900">
                    <span>Admin ETLE</span>
                    <button
                        onClick={closeSidebar}
                        className="md:hidden text-slate-400 hover:text-white focus:outline-none"
                        aria-label="Tutup menu"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-grow pt-4 overflow-y-auto">

                    {/* 1. Input Pelanggaran */}
                    <Link href="/admin/dashboard" onClick={closeSidebar} className={getLinkClass('/admin/dashboard')}>
                        <FaTachometerAlt className="w-5 h-5" />
                        <span>Input Pelanggaran</span>
                    </Link>

                    {/* 2. Input Kendaraan */}
                    <Link href="/admin/input-kendaraan" onClick={closeSidebar} className={getLinkClass('/admin/input-kendaraan')}>
                        <FaCar className="w-5 h-5" />
                        <span>Input Kendaraan</span>
                    </Link>

                    <div className="my-2 border-t border-slate-700 mx-4"></div> {/* Separator */}

                    {/* 3. Data Pelanggaran */}
                    <Link href="/admin/data-pelanggaran" onClick={closeSidebar} className={getLinkClass('/admin/data-pelanggaran')}>
                        <FaList className="w-5 h-5" />
                        <span>Data Pelanggaran</span>
                    </Link>

                    {/* 4. Data Kendaraan (BARU) */}
                    <Link href="/admin/data-kendaraan" onClick={closeSidebar} className={getLinkClass('/admin/data-kendaraan')}>
                        <FaDatabase className="w-5 h-5" />
                        <span>Data Kendaraan</span>
                    </Link>

                    <div className="my-2 border-t border-slate-700 mx-4"></div> {/* Separator */}

                    {/* 5. Riwayat Pembayaran */}
                    <Link href="/admin/riwayat-pembayaran" onClick={closeSidebar} className={getLinkClass('/admin/riwayat-pembayaran')}>
                        <FaHistory className="w-5 h-5" />
                        <span>Riwayat Pembayaran</span>
                    </Link>
                    {/* ... Link Riwayat Pembayaran ... */}

                    <div className="my-2 border-t border-slate-700 mx-4"></div> {/* Separator */}

                    {/* Link Feedback Pengguna */}
                    <Link
                        href="/admin/feedback"
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/feedback' ? 'bg-blue-800 border-r-4 border-blue-400' : 'hover:bg-slate-700'
                            }`}
                    >
                        <FaComments className="w-5 h-5" />
                        <span>Feedback Pengguna</span>
                    </Link>
                </nav>

                {/* Sidebar Footer (Logout) */}
                <div className="p-4 border-t border-slate-700 bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-y-auto relative w-full">
                {/* Mobile Header */}
                <header className="md:hidden bg-white shadow z-20 sticky top-0">
                    <div className="px-4 py-3 flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-800">Admin Panel</span>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Buka menu"
                            aria-controls="admin-sidebar"
                            aria-expanded={isSidebarOpen}
                            className="text-slate-600 hover:text-slate-900 focus:outline-none"
                        >
                            <FaBars className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Wrapper Konten Halaman */}
                <div className="p-4 md:p-8 flex-grow max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}