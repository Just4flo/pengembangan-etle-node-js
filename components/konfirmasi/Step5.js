// components/konfirmasi/Step5.js
import { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaSpinner, FaDownload } from 'react-icons/fa';

// Fungsi untuk memicu download (PNG)
const triggerDownload = (tilangId) => {
    try {
        const downloadUrl = `/api/bukti/${tilangId}`; // Panggil API yang menghasilkan PNG
        const link = document.createElement('a');
        link.href = downloadUrl;
        // Ubah ekstensi file menjadi .png
        link.download = `Bukti_Pembayaran_ETLE_${tilangId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch (error) {
        console.error("Gagal memicu unduhan:", error);
        return false;
    }
};

export default function Step5({ violationData, handleSuccessfulPayment, brivaNumber, tilangId }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    // Pastikan brivaNumber ada sebelum membuat URL QR code
    const qrCodeUrl = brivaNumber ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${brivaNumber}` : '';

    // Dipicu saat pengguna mengkonfirmasi pembayaran sudah lunas
    const onConfirmPayment = async () => {
        setIsProcessing(true);
        setDownloadError(null);
        try {
            const confirmedTilangId = await handleSuccessfulPayment();
            if (confirmedTilangId) {
                setIsPaymentConfirmed(true);
                // PICU DOWNLOAD OTOMATIS (PNG)
                const downloadSuccess = triggerDownload(confirmedTilangId);
                if (!downloadSuccess) {
                    setDownloadError("Gagal mengunduh bukti otomatis. Silakan klik tombol unduh manual.");
                }
            } else {
                throw new Error("Gagal mengkonfirmasi pembayaran.");
            }
        } catch (error) {
            alert(error.message || "Terjadi kesalahan saat memproses konfirmasi pembayaran.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- TAMPILAN JIKA PEMBAYARAN SUDAH LUNAS ---
    if (isPaymentConfirmed) {
        return (
            <div className="text-center py-8 text-gray-900">
                <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Pembayaran Denda Lunas!</h3>
                <p className="text-gray-700 mt-2 mb-6">Terima kasih. Bukti pembayaran Anda telah diunduh.</p>
                {downloadError && (<p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-md border border-red-300">{downloadError}</p>)}
                <button onClick={() => triggerDownload(tilangId)} className="mt-4 flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 disabled:bg-red-300"> <FaDownload /> <span>Unduh Ulang Bukti Pembayaran</span> </button>
                <Link href="/" className="mt-4 flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700"> Kembali ke Halaman Utama </Link>
            </div>
        );
    }

    // --- TAMPILAN AWAL STEP 5 ---
    return (
        <div className="text-center text-gray-900">
            <h3 className="text-xl font-bold text-green-600">Konfirmasi Berhasil!</h3>
            <p className="text-gray-700 mt-1 mb-8">Silakan lakukan pembayaran denda tilang menggunakan kode di bawah ini.</p>
            <div className="max-w-md mx-auto p-6 border rounded-lg bg-white">
                <h4 className="font-semibold text-gray-900">Kode Pembayaran BRIVA</h4>
                <p className="text-3xl font-bold text-blue-600 my-4 tracking-widest bg-gray-50 py-3 rounded-lg">{brivaNumber || '...'}</p> {/* Fallback jika brivaNumber null */}
                {qrCodeUrl && <img src={qrCodeUrl} alt="Kode QR Pembayaran BRIVA" className="mx-auto my-4 border rounded-lg" />}
                <div className="text-left text-sm text-gray-700 space-y-2">
                    <p><strong>Detail:</strong> Pembayaran Denda Tilang ETLE</p>
                    <p><strong>No. Polisi:</strong> {violationData?.noPolisi}</p>
                </div>
            </div>
            <button onClick={onConfirmPayment} disabled={isProcessing} className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs mx-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 disabled:bg-green-300">
                {isProcessing ? (<><FaSpinner className="animate-spin" /><span>Memproses Konfirmasi...</span></>) : (<span>Selesai & Konfirmasi Pembayaran</span>)}
            </button>
        </div>
    );
}