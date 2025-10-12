import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Accordion from '../../components/Accordion';
import Image from 'next/image'; // Gunakan Image dari Next.js untuk optimasi
import Link from 'next/link'; // Impor Link untuk tombol

// 1. Data FAQ diperbanyak agar sesuai dengan gambar
const faqData = [
    {
        id: 1,
        question: 'Saya menerima surat konfirmasi, apakah saya sudah ditilang?',
        answer: 'Belum. Surat konfirmasi adalah langkah awal dari penindakan di mana pemilik kendaraan wajib konfirmasi tentang kepemilikan kendaraan dan pengemudi saat terjadinya pelanggaran.',
    },
    {
        id: 2,
        question: 'Apa yang dimaksud dengan No Referensi dan No TNKB?',
        answer: 'No Referensi adalah nomor unik untuk proses konfirmasi pelanggaran. No TNKB adalah Nomor Tanda Kendaraan Bermotor (nomor polisi).',
    },
    {
        id: 3,
        question: 'Berapa lama batas waktu saya untuk konfirmasi?',
        answer: 'Batas waktu untuk melakukan konfirmasi adalah 8 hari sejak surat konfirmasi Anda terima. Melewati batas waktu dapat menyebabkan pemblokiran STNK sementara.',
    },
    {
        id: 4,
        question: 'Apakah saya harus membayar denda menggunakan BRIVA?',
        answer: 'Ya, setelah pelanggaran terverifikasi, pembayaran denda tilang dilakukan melalui metode pembayaran BRIVA (BRI Virtual Account).',
    },
    {
        id: 5,
        question: 'Kapan batas waktu terakhir untuk pembayaran?',
        answer: 'Batas waktu pembayaran denda adalah 15 hari setelah tanggal pelanggaran. Keterlambatan dapat dikenakan sanksi tambahan.',
    },
    {
        id: 6,
        question: 'Apakah saya dapat memilih untuk menghadiri sidang?',
        answer: 'Ya, Anda memiliki hak untuk memilih penyelesaian melalui sidang di pengadilan. Opsi ini tersedia saat proses konfirmasi.',
    },
    {
        id: 7,
        question: 'Bagaimana cara saya mendapatkan informasi mengenai tanggal dan lokasi pengadilan?',
        answer: 'Informasi detail mengenai jadwal dan lokasi sidang akan tercantum pada surat tilang yang diterbitkan setelah proses konfirmasi selesai.',
    },
    {
        id: 8,
        question: 'Apa yang terjadi jika saya tidak mengetahui pengendara saat pelanggaran?',
        answer: 'Anda tetap wajib melakukan konfirmasi. Anda bisa memberikan keterangan bahwa kendaraan sedang tidak Anda kemudikan dan memberikan data pengemudi jika diketahui.',
    },
    {
        id: 9,
        question: 'Jika kendaraan saya sudah dijual, apakah saya harus konfirmasi?',
        answer: 'Ya, Anda harus segera melakukan konfirmasi dan menyertakan bukti jual beli kendaraan agar pelanggaran tidak dibebankan kepada Anda.',
    },
    {
        id: 10,
        question: 'Apakah ada tempat untuk konsultasi mengenai surat konfirmasi?',
        answer: 'Tentu. Anda dapat datang langsung ke Posko Gakkum ETLE terdekat atau menghubungi layanan kontak yang tersedia di website ini.',
    }
];

export default function TanyaJawabPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow flex items-center justify-center bg-gray-100 p-4 pt-24 pb-12">
                {/* 2. Desain kartu utama dibuat lebih modern */}
                <div className="w-full max-w-5xl p-8 space-y-10 bg-white rounded-2xl shadow-xl">

                    {/* Bagian Header dengan Ilustrasi */}
                    <div className="text-center">
                        {/* Ganti 'src' dengan path gambar Anda di folder 'public' */}
                        <Image
                            src="/faq.svg"
                            alt="Ilustrasi Tanya Jawab"
                            width={500}
                            height={250}
                            className="mx-auto mb-4"
                        />
                        <h1 className="text-4xl font-extrabold text-slate-900">Tanya Jawab</h1>
                    </div>

                    {/* Bagian Accordion FAQ */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            Pertanyaan Yang Sering Diajukan
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {faqData.map((item) => (
                                <Accordion key={item.id} title={item.question}>
                                    <p className="text-slate-600">{item.answer}</p>
                                </Accordion>
                            ))}
                        </div>
                    </div>

                    {/* 3. Bagian Tombol CTA Baru */}
                    <div className="text-center border-t border-gray-200 pt-8">
                        <h3 className="text-xl font-bold text-slate-800">Masih Butuh Bantuan?</h3>
                        <p className="text-slate-500 mt-2 mb-6 max-w-xl mx-auto">
                            Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk menghubungi tim dukungan kami secara langsung.
                        </p>
                        <Link href="/kontak" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">
                            Hubungi Kami
                        </Link>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}