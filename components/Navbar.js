// components/Navbar.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaHome,
    FaInfoCircle,
    FaQuestionCircle,
    FaSearch,
    FaCheckCircle,
    FaPhoneAlt,
    FaChevronDown,
    FaBars,
    FaTimes,
    FaChartBar, // 1. Tambahkan ikon Chart
} from "react-icons/fa";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    return (
        <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 cursor-pointer">
                    <Image src="/LOGO.svg" alt="Korlantas" width={40} height={40} />
                    <span className="font-semibold text-lg tracking-wide">KORLANTAS</span>
                </Link>

                {/* Menu Desktop */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                        <FaHome /> Beranda
                    </Link>

                    {/* Dropdown KORLANTAS */}
                    <div className="relative group">
                        <button
                            onClick={() => toggleDropdown("etle")}
                            className="flex items-center gap-2 hover:text-gray-300 focus:outline-none transition-colors"
                        >
                            <FaInfoCircle /> KORLANTAS <FaChevronDown size={12} />
                        </button>

                        {dropdown === "etle" && (
                            <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50 animate-fade-in-up">
                                <Link href="/briva" className="block px-4 py-2 hover:bg-gray-100">
                                    Pembayaran BRIVA
                                </Link>
                                <Link href="/posko" className="block px-4 py-2 hover:bg-gray-100">
                                    Titik Kamera ETLE
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 2. Menu Statistik (Desktop) */}
                    <Link href="/statistik" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                        <FaChartBar /> Statistik
                    </Link>

                    <Link href="/tanya-jawab" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                        <FaQuestionCircle /> Tanya Jawab
                    </Link>
                    <Link href="/cek-data" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                        <FaSearch /> Cek Data
                    </Link>
                    <Link href="/konfirmasi" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                        <FaCheckCircle /> Konfirmasi
                    </Link>

                    <Link href="/kontak" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105">
                        <FaPhoneAlt className="text-sm" /> Kontak
                    </Link>
                </div>

                {/* Tombol Menu Mobile */}
                <button
                    className="md:hidden focus:outline-none text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden bg-zinc-900 text-white px-4 pt-2 pb-6 space-y-3 shadow-inner">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-800">
                        <FaHome /> Beranda
                    </Link>

                    <div>
                        <button
                            onClick={() => toggleDropdown("etle")}
                            className="w-full text-left flex justify-between items-center px-3 py-2 rounded hover:bg-zinc-800"
                        >
                            <span className="flex items-center gap-3"><FaInfoCircle /> Tentang ETLE</span>
                            <FaChevronDown className={`transform transition-transform ${dropdown === 'etle' ? 'rotate-180' : ''}`} size={12} />
                        </button>
                        {dropdown === "etle" && (
                            <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-700 pl-3">
                                <Link href="/briva" className="block py-2 text-gray-300 hover:text-white">
                                    Pembayaran BRIVA
                                </Link>
                                <Link href="/posko" className="block py-2 text-gray-300 hover:text-white">
                                    Titik Kamera ETLE
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 3. Menu Statistik (Mobile) */}
                    <Link href="/statistik" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-800">
                        <FaChartBar /> Statistik
                    </Link>

                    <Link href="/tanya-jawab" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-800">
                        <FaQuestionCircle /> Tanya Jawab
                    </Link>
                    <Link href="/cek-data" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-800">
                        <FaSearch /> Cek Data
                    </Link>
                    <Link href="/konfirmasi" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-zinc-800">
                        <FaCheckCircle /> Konfirmasi
                    </Link>

                    <div className="pt-2">
                        <Link href="/kontak" className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full font-semibold">
                            <FaPhoneAlt /> Hubungi Kami
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}