// pages/kontak/index.js
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaSpinner } from 'react-icons/fa';

// Data Kontak dan Media Sosial
const contactInfo = [
    { icon: '☎️', title: 'Call Center', detail: '1-500-669' }, // Call Center NTMC
    { icon: '✉️', title: 'Email', detail: 'info@korlantas.polri.go.id' },
    { icon: '🌐', title: 'Website', detail: 'korlantas.polri.go.id' },
];

const socialMedia = [
    {
        icon: '/icons/facebook.svg',
        name: 'Facebook',
        handle: 'NTMC POLRI',
        url: 'https://www.facebook.com/NTMCPolri'
    },
    {
        icon: '/icons/twitter.svg',
        name: 'Twitter (X)',
        handle: '@NTMCLantasPolri',
        url: 'https://twitter.com/NTMCLantasPolri'
    },
    {
        icon: '/icons/instagram.svg',
        name: 'Instagram',
        handle: '@ntmc_polri',
        url: 'https://www.instagram.com/ntmc_polri/'
    },
    {
        icon: '/icons/tiktok.svg',
        name: 'TikTok',
        handle: '@ntmcpolri',
        url: 'https://www.tiktok.com/@ntmcpolri'
    },
];
export default function KontakPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simpan ke koleksi 'feedback pengguna'
            await addDoc(collection(db, 'feedback pengguna'), {
                nama: formData.name,
                email: formData.email,
                pesan: formData.message,
                waktuDibuat: serverTimestamp(),
                status: 'Baru'
            });

            alert('Terima kasih! Pesan Anda telah berhasil dikirim.');
            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error("Error saat mengirim feedback: ", error);
            alert('Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
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
                                    <div className="w-8 h-8 mr-4 text-2xl flex justify-center items-center">
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
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    // PERBAIKAN: Menambahkan 'text-gray-900' agar teks hitam pekat
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    // PERBAIKAN: Menambahkan 'text-gray-900' agar teks hitam pekat
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="nama@email.com"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    // PERBAIKAN: Menambahkan 'text-gray-900' agar teks hitam pekat
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                                    required
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center disabled:bg-blue-400"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" /> Mengirim...
                                    </>
                                ) : (
                                    'Kirim Pesan'
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
