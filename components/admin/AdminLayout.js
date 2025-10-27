// components/admin/AdminLayout.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// 📌 Pastikan path ini 100% benar relatif terhadap file AdminLayout.js
import { auth } from '../../config/firebase';
// Tambahkan ikon FaList atau FaTable jika mau
import { FaTachometerAlt, FaCar, FaSignOutAlt, FaHistory, FaBars, FaTimes, FaList } from 'react-icons/fa';

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
    }, [router]); // Tambahkan router sebagai dependensi

    const handleLogout = async () => {
        // Tutup sidebar sebelum logout (jika terbuka di mobile)
        setIsSidebarOpen(false);
        try {
            await signOut(auth);
            router.push('/'); // Arahkan ke halaman utama setelah logout
        } catch (error) {
            console.error("Logout failed:", error);
            // Handle logout error if needed
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

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
                    onClick={closeSidebar} // Tutup saat klik backdrop
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar */}
            <aside
                id="admin-sidebar" // ID untuk aria-controls
                className={`fixed top-0 left-0 h-full z-40 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 md:flex-shrink-0`} // Tambah flex-shrink-0 untuk desktop
                aria-label="Menu Admin"
            >
                <div className="p-5 text-2xl font-bold border-b border-slate-700 flex justify-between items-center">
                    Admin ETLE
                    {/* Tombol Close Sidebar (hanya muncul di mobile saat sidebar terbuka) */}
                    <button
                        onClick={closeSidebar}
                        className="md:hidden text-slate-400 hover:text-white"
                        aria-label="Tutup menu"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                {/* Bagian Navigasi */}
                <nav className="flex-grow pt-4 overflow-y-auto">
                    {/* 1. Link Input Pelanggaran (Dashboard) */}
                    <Link href="/admin/dashboard" onClick={closeSidebar} className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/dashboard' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaTachometerAlt /> <span>Input Pelanggaran</span>
                    </Link>

                    {/* 2. Link Input Kendaraan (ASLI) */}
                    <Link href="/admin/input-kendaraan" onClick={closeSidebar} className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/input-kendaraan' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaCar /> <span>Input Kendaraan</span>
                    </Link>

                    {/* 3. LINK BARU: Data Pelanggaran (Menampilkan Tabel) */}
                    <Link
                        href="/admin/data-pelanggaran" // Arahkan ke halaman tabel data
                        onClick={closeSidebar}
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/data-pelanggaran' ? 'bg-blue-800' : 'hover:bg-slate-700'
                            }`}
                    >
                        <FaList /> {/* Menggunakan ikon daftar */}
                        <span>Data Pelanggaran</span>
                    </Link>

                    {/* 4. Link Riwayat Pembayaran */}
                    <Link href="/admin/riwayat-pembayaran" onClick={closeSidebar} className={`flex items-center gap-3 px-6 py-3 transition-colors ${currentPath === '/admin/riwayat-pembayaran' ? 'bg-blue-800' : 'hover:bg-slate-700'}`}>
                        <FaHistory /> <span>Riwayat Pembayaran</span>
                    </Link>
                </nav>

                {/* Tombol Logout */}
                <div className="p-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header hanya muncul di mobile (md:hidden) */}
                <header className="md:hidden bg-white shadow z-20 sticky top-0">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-800">Admin ETLE</span>
                        {/* Tombol Burger untuk membuka sidebar */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Buka menu"
                            aria-controls="admin-sidebar" // Kontrol ID sidebar
                            aria-expanded={isSidebarOpen} // Status sidebar
                        >
                            <FaBars className="w-6 h-6 text-slate-800" />
                        </button>
                    </div>
                </header>

                {/* Wrapper konten halaman */}
                <div className="p-4 md:p-8 flex-grow"> {/* Tambah flex-grow */}
                    {children}
                </div>
            </main>
        </div>
    );
}