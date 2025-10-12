import Accordion from '../../components/Accordion';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';

export default function BrivaPage() {
    return (
        // Gunakan div atau fragment sebagai pembungkus utama
        <div>
            <Navbar /> {/* 2. Tampilkan komponen Navbar di paling atas */}

            {/* 3. Tambahkan padding-top (pt-20) di sini! */}
            {/* Ini sangat penting agar konten tidak tersembunyi di belakang Navbar. */}
            <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4 pt-20">
                <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-800">
                            BRI Virtual Account (BRIVA)
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Panduan lengkap pembayaran melalui BRIVA
                        </p>
                    </div>

                    {/* Payment Details Card */}
                    <div className="p-6 bg-white border border-gray-200 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Pembayaran Briva
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bagaimana cara pembayaran melalui BRIVA?
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Accordion untuk Teller BRI */}
                            <div>
                                <Accordion title="Teller BRI">
                                    <ol className="list-decimal list-inside space-y-3">
                                        <li>Ambil nomor antrian transaksi teller dan isi slip setoran.</li>
                                        <li>Isikan 15 angka Nomor Pembayaran Tilang pada kolom 'Nomor Rekening' dan nominal titipan denda tilang pada slip setoran.</li>
                                        <li>Serahkan slip setoran kepada Teller BRI.</li>
                                        <li>Teller BRI akan melakukan validasi transaksi.</li>
                                        <li>Simpan Slip Setoran hasil validasi sebagai bukti pembayaran yang sah.</li>
                                    </ol>
                                </Accordion>
                            </div>

                            {/* Accordion untuk ATM BRI */}
                            <div>
                                <Accordion title="ATM BRI">
                                    <ol className="list-decimal list-inside space-y-3">
                                        <li>Masukkan Kartu Debit BRI dan PIN Anda.</li>
                                        <li>Pilih menu Transaksi Lain &gt; Pembayaran &gt; Lainnya &gt; BRIVA.</li>
                                        <li>Masukkan 15 angka Nomor Pembayaran Tilang.</li>
                                        <li>Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai seperti Nomor BRIVA, Nama Pelanggar dan Jumlah Pembayaran.</li>
                                        <li>Ikuti instruksi untuk menyelesaikan transaksi.</li>
                                        <li>Simpan struk ATM sebagai bukti pembayaran.</li>
                                    </ol>
                                </Accordion>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}