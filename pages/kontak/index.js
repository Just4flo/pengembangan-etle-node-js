import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import { useState } from 'react';

// Data Kontak dan Media Sosial
const contactInfo = [
    { icon: '☎️', title: 'Call Center', detail: '1500-669' },
    { icon: '✉️', title: 'Email', detail: 'info@korlantas.polri.go.id' },
    { icon: '🌐', title: 'Website', detail: 'korlantas.polri.go.id' },
];

const socialMedia = [
    { icon: '/icons/facebook.svg', name: 'Facebook', handle: 'NTMC POLRI', url: '#' },
    { icon: '/icons/twitter.svg', name: 'Twitter (X)', handle: '@ntmcpoldametro', url: '#' },
    { icon: '/icons/instagram.svg', name: 'Instagram', handle: '@ntmcpoldametro', url: '#' },
    { icon: '/icons/tiktok.svg', name: 'TikTok', handle: '@ntmcpoldametro', url: '#' },
];


export default function KontakPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert('Terima kasih! Pesan Anda telah terkirim (simulasi).');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div>
            <Navbar />

            <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4 pt-20">
                <div className="w-full max-w-5xl p-8 space-y-10 bg-white rounded-lg shadow-md">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800">Hubungi Kami</h1>
                        <p className="text-gray-500 mt-2">
                            Kami siap membantu Anda. Silakan hubungi kami melalui salah satu saluran di bawah ini.
                        </p>
                    </div>

                    {/* Grid Informasi Kontak & Media Sosial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kolom Kiri: Kontak Langsung */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Informasi Kontak</h2>
                            {contactInfo.map(item => (
                                <div key={item.title} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl mr-4">{item.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-blue-600">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Kolom Kanan: Media Sosial */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Media Sosial</h2>
                            {socialMedia.map(social => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    {/* Anda perlu menyiapkan file SVG ikon di folder public/icons/ */}
                                    {/* <img src={social.icon} alt={social.name} className="w-8 h-8 mr-4"/> */}
                                    <div className="w-8 h-8 mr-4 text-2xl"> {/* Placeholder Ikon jika SVG tidak ada */}
                                        {social.name === 'Facebook' && '📘'}
                                        {social.name === 'Twitter (X)' && '🐦'}
                                        {social.name === 'Instagram' && '📸'}
                                        {social.name === 'TikTok' && '🎵'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{social.name}</h3>
                                        <p className="text-gray-500">{social.handle}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Formulir Kontak */}
                    <div className="border-t pt-8">
                        <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">Kirim Pesan Langsung</h2>
                        <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
                                <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                                <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                                <textarea id="message" rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
                                Kirim Pesan
                            </button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}