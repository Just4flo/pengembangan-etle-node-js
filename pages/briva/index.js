import Accordion from '../../components/Accordion';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Image from 'next/image'; // Impor komponen Image dari Next.js

// 1. Data dipisahkan agar mudah dikelola
const paymentMethods = [
    {
        title: "Teller BRI",
        steps: [
            "Ambil nomor antrian transaksi teller dan isi slip setoran.",
            "Isikan 15 angka Nomor Pembayaran Tilang pada kolom 'Nomor Rekening' dan nominal denda.",
            "Serahkan slip setoran kepada Teller BRI.",
            "Teller BRI akan melakukan validasi transaksi.",
            "Simpan Slip Setoran sebagai bukti pembayaran yang sah.",
        ]
    },
    {
        title: "ATM BRI",
        steps: [
            "Masukkan Kartu Debit BRI dan PIN Anda.",
            "Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA.",
            "Masukkan 15 angka Nomor Pembayaran Tilang.",
            "Pastikan detil pembayaran sudah sesuai (No. BRIVA, Nama, Jumlah).",
            "Ikuti instruksi untuk menyelesaikan transaksi.",
            "Simpan struk ATM sebagai bukti pembayaran.",
        ]
    },
    {
        title: "Mobile Banking BRI",
        steps: [
            "Login ke aplikasi BRImo.",
            "Pilih menu 'BRIVA'.",
            "Masukkan 15 angka Nomor Pembayaran Tilang.",
            "Masukkan jumlah pembayaran sesuai denda.",
            "Masukkan PIN Anda untuk memverifikasi transaksi.",
            "Simpan notifikasi sebagai bukti pembayaran.",
        ]
    },
    {
        title: "Internet Banking BRI",
        steps: [
            "Login ke ib.bri.co.id.",
            "Pilih menu 'Pembayaran & Tagihan', lalu pilih 'BRIVA'.",
            "Masukkan 15 angka Nomor Pembayaran Tilang.",
            "Verifikasi detail transaksi Anda.",
            "Masukkan password dan mToken untuk menyelesaikan.",
            "Cetak atau simpan bukti pembayaran.",
        ]
    },
    {
        title: "EDC BRI",
        steps: [
            "Pilih menu 'Mini ATM'.",
            "Pilih menu 'Pembayaran', lalu pilih 'BRIVA'.",
            "Gesek Kartu Debit BRI Anda.",
            "Masukkan 15 angka Nomor Pembayaran Tilang dan PIN.",
            "Verifikasi transaksi pada layar konfirmasi.",
            "Simpan struk transaksi sebagai bukti.",
        ]
    },
    {
        title: "Transfer dari Bank Lain",
        steps: [
            "Pilih menu 'Transfer Antar Bank' atau 'Transfer Online'.",
            "Masukkan kode Bank BRI (002) diikuti dengan 15 angka Nomor Pembayaran Tilang.",
            "Masukkan jumlah pembayaran sesuai nominal denda.",
            "Konfirmasi detail transaksi Anda.",
            "Ikuti instruksi bank Anda untuk menyelesaikan transfer.",
            "Simpan bukti transfer.",
        ]
    }
];

export default function BrivaPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow flex items-center justify-center bg-gray-100 p-4 pt-24 pb-12">
                {/* 2. Hanya ada satu kartu putih utama */}
                <div className="w-full max-w-5xl p-8 space-y-8 bg-white rounded-2xl shadow-xl">

                    {/* Header Section dengan Ilustrasi */}
                    <div className="text-center">
                        {/* Ganti 'src' dengan path gambar Anda di folder 'public' */}
                        <Image
                            src="/briva.svg"
                            alt="Ilustrasi Pembayaran"
                            width={300}
                            height={150}
                            className="mx-auto mb-6"
                        />
                        <h1 className="text-4xl font-extrabold text-slate-900">
                            BRI Virtual Account (BRIVA)
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Panduan lengkap pembayaran melalui BRIVA
                        </p>
                    </div>

                    {/* Payment Details Card */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Pembayaran Briva
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Bagaimana cara pembayaran melalui BRIVA?
                        </p>

                        {/* 3. Grid 2-kolom untuk metode pembayaran */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {/* Looping data agar kode bersih */}
                            {paymentMethods.map((method) => (
                                <Accordion key={method.title} title={method.title}>
                                    <ol className="list-decimal list-inside space-y-3 text-slate-600">
                                        {method.steps.map((step, index) => (
                                            <li key={index}>{step.replace(/>/g, '&gt;')}</li>
                                        ))}
                                    </ol>
                                </Accordion>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}