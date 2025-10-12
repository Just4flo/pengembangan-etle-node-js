import { useState } from 'react';
import Link from 'next/link';
import Modal from '../Modal';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function Step5({ violationData, handleSuccessfulPayment }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const brivaNumber = `88755${Date.now().toString().slice(-8)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${brivaNumber}`;

    const onConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            await handleSuccessfulPayment();
            setIsModalOpen(true);
        } catch (error) {
            console.log("Proses pembayaran gagal, modal tidak ditampilkan.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <h3 className="text-xl font-bold text-green-600">Konfirmasi Berhasil!</h3>
                <p className="text-slate-500 mt-1 mb-8">Silakan lakukan pembayaran denda tilang menggunakan kode di bawah ini.</p>
                <div className="max-w-md mx-auto p-6 border rounded-lg bg-slate-50">
                    <h4 className="font-semibold text-slate-800">Kode Pembayaran BRIVA</h4>
                    <p className="text-3xl font-bold text-blue-600 my-4 tracking-widest bg-white py-3 rounded-lg">{brivaNumber}</p>
                    <img src={qrCodeUrl} alt="Kode QR Pembayaran BRIVA" className="mx-auto my-4 border rounded-lg" />
                    <div className="text-left text-sm text-slate-600 space-y-2">
                        <p><strong>Detail:</strong> Pembayaran Denda Tilang ETLE</p>
                        <p><strong>No. Polisi:</strong> {violationData.noPolisi}</p>
                    </div>
                </div>
                <button onClick={onConfirmPayment} disabled={isProcessing} className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs mx-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 disabled:bg-green-300">
                    {isProcessing ? (<><FaSpinner className="animate-spin" /><span>Memproses...</span></>) : (<span>Selesai & Konfirmasi Pembayaran</span>)}
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Pembayaran Berhasil!</h2>
                <p className="text-gray-600 mt-2 mb-6">Terima kasih. Data pembayaran Anda telah berhasil disimpan.</p>
                <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 w-full inline-block">Kembali ke Halaman Utama</Link>
            </Modal>
        </>
    );
}