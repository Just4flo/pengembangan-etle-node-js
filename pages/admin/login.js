import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FaSignInAlt } from 'react-icons/fa';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();

    // Fungsi validasi form
    const validateForm = () => {
        const errors = {};

        // Validasi email
        if (!email) {
            errors.email = 'Email harus diisi';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Format email tidak valid';
        }

        // Validasi password
        if (!password) {
            errors.password = 'Password harus diisi';
        } else if (password.length < 6) {
            errors.password = 'Password minimal 6 karakter';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setFormErrors({});

        // Validasi form sebelum submit
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err) {
            let errorMessage = 'Email atau password salah. Silakan coba lagi.';

            // Handle error spesifik dari Firebase
            switch (err.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Format email tidak valid';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Akun ini telah dinonaktifkan';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Email tidak terdaftar';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Password salah';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Terlalu banyak percobaan login. Coba lagi nanti.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Koneksi internet bermasalah';
                    break;
                default:
                    errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
            }

            setError(errorMessage);

            // Alert tambahan (opsional)
            if (typeof window !== 'undefined') {
                alert(`Login Gagal!\n${errorMessage}`);
            }

            console.error('Login error:', err.code, err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menghapus error saat user mulai mengetik
    const clearError = (field) => {
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
        if (error) {
            setError(null);
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
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearError('email');
                            }}
                            className={`w-full p-3 mt-1 border rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.email ? 'border-red-500' : 'border-slate-300'
                                }`}
                            required
                            placeholder="Masukkan email admin"
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearError('password');
                            }}
                            className={`w-full p-3 mt-1 border rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.password ? 'border-red-500' : 'border-slate-300'
                                }`}
                            required
                            placeholder="Masukkan password"
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition duration-200"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Memproses...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-sm text-blue-600 hover:underline transition duration-200">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}