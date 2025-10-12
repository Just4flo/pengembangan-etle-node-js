import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Accordion from '../../components/Accordion'; // Kita gunakan lagi komponen ini

// Data untuk Tanya Jawab. Nanti bisa diambil dari database.
const faqData = [
    {
        id: 1,
        question: 'Saya menerima surat konfirmasi, apakah saya sudah ditilang?',
        answer: 'Belum. Surat konfirmasi adalah langkah awal dari penindakan di mana pemilik kendaraan wajib konfirmasi tentang kepemilikan kendaraan dan pengemudi saat terjadinya pelanggaran.',
    },
    {
        id: 2,
        question: 'Apa yang dimaksud dengan No Referensi dan No TNKB?',
        answer: 'No Referensi adalah nomor unik yang digunakan untuk proses konfirmasi pelanggaran. No TNKB adalah Nomor Tanda Kendaraan Bermotor atau yang biasa disebut nomor polisi kendaraan Anda.',
    },
    {
        id: 3,
        question: 'Bagaimana cara melakukan konfirmasi pelanggaran?',
        answer: 'Anda dapat melakukan konfirmasi secara online melalui situs web resmi ETLE atau datang langsung ke Posko Gakkum ETLE terdekat yang tertera di surat konfirmasi.',
    },
    {
        id: 4,
        question: 'Berapa lama batas waktu untuk melakukan konfirmasi?',
        answer: 'Batas waktu untuk melakukan konfirmasi adalah 8 hari sejak surat konfirmasi Anda terima. Jika melewati batas waktu, STNK Anda dapat diblokir sementara.',
    },
];

export default function TanyaJawabPage() {
    return (
        <div>
            <Navbar />

            <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4 pt-20">
                <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">

                    {/* Bagian Header dengan Ilustrasi */}
                    <div className="text-center">
                        {/* Ganti dengan URL ilustrasi Anda */}
                        <img
                            src="https://ouch-cdn2.icons8.com/X1s8z1z8_3BYk32v5A5A82EkvJc4s5T32T2_N_T9Z6A/rs:fit:1026:912/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzgx/LzVjYzA0MTY5LWMz/MjAtNDM0ZC05OGFj/LTczYzc3MmVmY2M2/NC5zdmc.png"
                            alt="Ilustrasi FAQ"
                            className="w-64 h-auto mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">Tanya Jawab</h1>
                    </div>

                    {/* Bagian Accordion FAQ */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Pertanyaan Yang Sering Diajukan
                        </h2>

                        {/* Grid untuk menampilkan 2 kolom di layar medium ke atas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {faqData.map((item) => (
                                <Accordion key={item.id} title={item.question}>
                                    <p>{item.answer}</p>
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