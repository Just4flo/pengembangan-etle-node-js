import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-8">
            <div className="container mx-auto px-4">
                {/* Baris atas untuk navigasi dan media sosial */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 mb-6 gap-6">

                    {/* Link Navigasi */}
                    <nav className="flex items-center space-x-6 text-sm text-gray-300">
                        <Link href="/posko" className="hover:text-blue-400 transition-colors duration-300">
                            Posko ETLE
                        </Link>
                        <Link href="/kebijakan-privasi" className="hover:text-blue-400 transition-colors duration-300">
                            Kebijakan Privasi
                        </Link>
                        <Link href="/syarat-ketentuan" className="hover:text-blue-400 transition-colors duration-300">
                            Syarat & Ketentuan
                        </Link>
                    </nav>

                    {/* Ikon Media Sosial */}
                    <div className="flex items-center space-x-5">
                        <a href="https://web.facebook.com/roadsafetykorlantas/?_rdc=1&_rdr#" aria-label="Facebook" className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300">
                            <FaFacebook size={22} />
                        </a>
                        <a href="https://x.com/korlantasid" aria-label="Twitter" className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300">
                            <FaTwitter size={22} />
                        </a>
                        <a href="https://www.instagram.com/korlantaspolri.ntmc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" className="text-gray-400 hover:text-white transform hover:scale-110 transition-all duration-300">
                            <FaInstagram size={22} />
                        </a>
                    </div>
                </div>

                {/* Baris bawah untuk copyright */}
                <div className="text-center text-sm text-gray-500">
                    <p>Copyright © {currentYear} ETLE Nasional. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
}