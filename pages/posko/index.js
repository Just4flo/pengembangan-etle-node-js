import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';

// Data dummy, nanti diganti dari Firebase
const allPosko = [
    { id: 1, name: 'Polda Aceh', address: 'Jl. Teuku Nyak Arief No.212, Kota Banda Aceh' },
    { id: 2, name: 'Polda Bali', address: 'Jl. WR Supratman No.7, Kota Denpasar' },
    { id: 3, name: 'Polda Banten', address: 'Jl. Syekh Nawawi Al Bantani No.76, Kota Serang' },
    { id: 4, name: 'Polda Bengkulu', address: 'Jl. Adam Malik No.KM. 9, Kota Bengkulu' },
    { id: 5, name: 'Polda D.I. Yogyakarta', address: 'Jl. Ring Road Utara, Kabupaten Sleman' },
    { id: 6, name: 'Polda DKI Jakarta (Metro Jaya)', address: 'Jl. Jenderal Sudirman No.55, Jakarta Selatan' },
    { id: 7, name: 'Polda Gorontalo', address: 'Jl. Drs. H. Achmad Hoesa, Kota Gorontalo' },
    { id: 8, name: 'Polda Jambi', address: 'Jl. Jenderal Sudirman No.45, Kota Jambi' },
    { id: 9, name: 'Polda Jawa Barat', address: 'Jl. Soekarno Hatta No.748, Kota Bandung' },
    { id: 10, name: 'Polda Jawa Tengah', address: 'Jl. Pahlawan No.1, Kota Semarang' },
];

export default function PoskoPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosko, setFilteredPosko] = useState(allPosko);

    useEffect(() => {
        const results = allPosko.filter(posko =>
            posko.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosko(results);
    }, [searchQuery]);

    return (
        <div>
            <Navbar />

            {/* STRUKTUR UTAMA YANG DIUBAH AGAR SAMA DENGAN HALAMAN LAIN */}
            <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4 pt-20">
                <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">

                    {/* Bagian Header digabung ke dalam kartu */}
                    <div className="text-center">
                        <img
                            src="/posko.svg"
                            alt="Ilustrasi orang mencari arah"
                            className="w-56 h-auto mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">Posko Gakkum ETLE</h1>
                        <p className="text-gray-500 mt-2">
                            Alamat Posko Gakkum ETLE untuk pengaduan dan konfirmasi manual.
                        </p>
                    </div>

                    {/* Bagian Pencarian dan Hasil */}
                    <div>
                        {/* Kolom Pencarian */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama Polda..."
                                className="w-full p-3 pl-10 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute top-3.5 left-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Daftar Hasil */}
                        <div className="space-y-4">
                            {filteredPosko.length > 0 ? (
                                filteredPosko.map(posko => (
                                    <div key={posko.id} className="p-4 border rounded-md hover:bg-gray-50">
                                        <h3 className="text-lg font-semibold text-blue-700">{posko.name}</h3>
                                        <p className="text-gray-600">{posko.address}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Polda tidak ditemukan.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}