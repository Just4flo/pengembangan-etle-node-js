import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        // Gunakan warna latar belakang biru tua yang pekat
        <footer className="bg-[#0D284D] text-gray-300 py-5">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">

                {/* Sisi Kiri: Copyright */}
                <div className="mb-2 md:mb-0">
                    <p>Copyright © {currentYear} ETLE Nasional</p>
                </div>

                {/* Sisi Kanan: Link Navigasi */}
                <nav className="flex items-center space-x-4">
                    <Link href="/posko" className="hover:text-white hover:underline">
                        Posko ETLE
                    </Link>
                    <span className="text-gray-500 select-none">|</span>
                    <Link href="/kebijakan-privasi" className="hover:text-white hover:underline">
                        Kebijakan Privasi
                    </Link>
                    <span className="text-gray-500 select-none">|</span>
                    <Link href="/syarat-ketentuan" className="hover:text-white hover:underline">
                        Syarat & Ketentuan
                    </Link>
                </nav>

            </div>
        </footer>
    );
}