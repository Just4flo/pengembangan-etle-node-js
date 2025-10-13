import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // 📌 1. Impor Link untuk tombol kembali
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FaSignInAlt } from 'react-icons/fa';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State untuk loading
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Email atau password salah. Silakan coba lagi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <FaSignInAlt className="mx-auto text-blue-600 text-4xl mb-3" />
                    <h1 className="text-3xl font-bold text-slate-800">Admin Login</h1>
                    <p className="text-slate-500 mt-2">Masuk untuk mengelola sistem ETLE.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // 📌 2. Tambahkan text-slate-900 agar teks input hitam
                            className="w-full p-3 mt-1 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // 📌 2. Tambahkan text-slate-900 agar teks input hitam
                            className="w-full p-3 mt-1 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Memproses...' : 'Login'}
                    </button>
                </form>

                {/* 📌 3. Tombol kembali ke halaman utama */}
                <div className="text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}