// pages/lokasi-etle.js
import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import { FaMapMarkerAlt, FaSearch, FaVideo, FaTrafficLight, FaExternalLinkAlt } from 'react-icons/fa';

// Data Lokasi Kamera ETLE Khusus Jawa Barat
const allEtlePoints = [
    { id: 1, city: 'Kota Bandung', location: 'Simpang Dago - Jl. Ir. H. Djuanda', type: 'E-Police' },
    { id: 2, city: 'Kota Bandung', location: 'Simpang Lima Asia Afrika', type: 'Check Point' },
    { id: 3, city: 'Kota Bandung', location: 'Jl. Soekarno Hatta (Simpang Buah Batu)', type: 'Speed Cam' },
    { id: 4, city: 'Kota Bandung', location: 'Jl. Pasteur (Gerbang Tol)', type: 'Check Point' },
    { id: 5, city: 'Kota Bogor', location: 'Simpang Tugu Kujang - Jl. Pajajaran', type: 'E-Police' },
    { id: 6, city: 'Kota Depok', location: 'Jl. Margonda Raya (JPO Balaikota)', type: 'E-Police' },
    { id: 7, city: 'Kota Depok', location: 'Simpang Juanda - Margonda', type: 'Check Point' },
    { id: 8, city: 'Kab. Bekasi', location: 'Simpang SGC (Sentra Grosir Cikarang)', type: 'E-Police' },
    { id: 9, city: 'Kota Cirebon', location: 'Jl. Siliwangi (Simpang Kejaksan)', type: 'Check Point' },
    { id: 10, city: 'Kota Cirebon', location: 'Jl. Kartini (Simpang Gunung Sari)', type: 'E-Police' },
    { id: 11, city: 'Kab. Bandung', location: 'Simpang Cileunyi', type: 'Check Point' },
    { id: 12, city: 'Kota Tasikmalaya', location: 'Simpang Masjid Agung - Jl. HZ Mustofa', type: 'E-Police' },
    { id: 13, city: 'Kab. Karawang', location: 'Simpang Galuh Mas', type: 'Check Point' },
    { id: 14, city: 'Kota Cimahi', location: 'Simpang Alun-Alun Cimahi', type: 'E-Police' },
    { id: 15, city: 'Kab. Sumedang', location: 'Simpang Taman Telur', type: 'Check Point' },
];

export default function LokasiEtlePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPoints, setFilteredPoints] = useState(allEtlePoints);

    useEffect(() => {
        const results = allEtlePoints.filter(point =>
            point.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            point.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPoints(results);
    }, [searchQuery]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-grow pt-28 pb-12 px-4">
                <div className="container mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm">
                            <FaTrafficLight className="text-3xl" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
                            Titik ETLE <span className="text-blue-600">Jawa Barat</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            Pemantauan lalu lintas elektronik di berbagai wilayah hukum Polda Jawa Barat.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400 text-lg" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari jalan atau kota (misal: Bandung)..."
                            className="w-full py-4 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Grid Hasil Pencarian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPoints.length > 0 ? (
                            filteredPoints.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">

                                    {/* Google Maps Embed (Preview) */}
                                    <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            marginHeight="0"
                                            marginWidth="0"
                                            title={item.location}
                                            loading="lazy"
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(item.location + ', ' + item.city + ', Jawa Barat')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                            className="absolute inset-0 w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700"
                                        ></iframe>

                                        {/* Label Tipe Kamera */}
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-800 shadow-sm border border-blue-100 flex items-center gap-1">
                                            <FaVideo /> {item.type}
                                        </div>
                                    </div>

                                    {/* Detail Text */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-start gap-3 mb-3">
                                            <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0 text-lg" />
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                                                    {item.location}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1 font-medium">{item.city}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                ● Kamera Aktif
                                            </span>

                                            {/* --- PERBAIKAN DI SINI --- */}
                                            {/* Mengubah Button menjadi Link <a> ke Google Maps */}
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location + ', ' + item.city)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-slate-600 font-medium hover:text-blue-600 transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200"
                                            >
                                                Lihat di Peta <FaExternalLinkAlt className="text-xs" />
                                            </a>
                                            {/* ------------------------- */}

                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaSearch className="text-gray-300 text-4xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700">Lokasi tidak ditemukan</h3>
                                <p className="text-slate-500">Coba cari dengan kata kunci nama jalan atau kota lain di Jawa Barat.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}