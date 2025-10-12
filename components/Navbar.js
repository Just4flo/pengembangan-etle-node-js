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
                <div className="flex items-center space-x-2">
                    <Image src="/LOGO.svg" alt="Korlantas" width={40} height={40} />
                    <span className="font-semibold text-lg">KORLANTAS</span>
                </div>

                {/* Menu Desktop */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
                        <FaHome /> Beranda
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown("etle")}
                            className="flex items-center gap-2 hover:text-gray-300"
                        >
                            <FaInfoCircle /> KORLANTAS <FaChevronDown size={12} />
                        </button>
                        {dropdown === "etle" && (
                            <div className="absolute bg-black text-white mt-2 rounded shadow-lg w-40">
                                <Link href="/briva" className="block px-4 py-2 hover:bg-gray-700">
                                    Pembayaran BRIVA
                                </Link>
                                <Link href="/posko" className="block px-4 py-2 hover:bg-gray-700">
                                    Posko ETLE
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/tanya-jawab"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaQuestionCircle /> Tanya Jawab
                    </Link>
                    <Link
                        href="/cek-data"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaSearch /> Cek Data
                    </Link>
                    <Link
                        href="/konfirmasi"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaCheckCircle /> Konfirmasi
                    </Link>

                    <Link href="/kontak" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        <FaPhoneAlt /> Kontak
                    </Link>
                </div>

                {/* Tombol Menu Mobile */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden bg-black text-white px-4 pb-4 space-y-2">
                    <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
                        <FaHome /> Beranda
                    </Link>

                    <button
                        onClick={() => toggleDropdown("etle")}
                        className="w-full text-left flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaInfoCircle /> Tentang ETLE
                    </button>
                    {dropdown === "etle" && (
                        <div className="ml-4 space-y-1">
                            <Link href="/briva" className="block hover:text-gray-300">
                                BRIVA
                            </Link>
                            <Link href="/posko" className="block hover:text-gray-300">
                                Posko ETLE
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/tanya-jawab"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaQuestionCircle /> Tanya Jawab
                    </Link>
                    <Link
                        href="/cek-data"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaSearch /> Cek Data
                    </Link>
                    <Link
                        href="/konfirmasi"
                        className="flex items-center gap-2 hover:text-gray-300"
                    >
                        <FaCheckCircle /> Konfirmasi
                    </Link>

                    <Link href="/kontak" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        <FaPhoneAlt /> Kontak
                    </Link>
                </div>
            )}
        </nav>
    );
}
