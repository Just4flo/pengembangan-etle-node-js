// components/Chatbot.js
import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const WHATSAPP_NUMBER = "6281901500669"; // Ganti dengan nomor asli

    // --- DATA PERTANYAAN & JAWABAN (KNOWLEDGE BASE) ---
    const knowledgeBase = [
        {
            keywords: ['cek', 'data', 'kena', 'tilang', 'status'],
            response: "🔍 **Cara Cek Status Tilang:**\n1. Buka menu 'Cek Data' di website ini.\n2. Masukkan No Polisi, No Mesin, dan No Rangka.\n3. Klik 'Cek Data'.\n\nJika ada pelanggaran, data akan muncul beserta fotonya.",
            buttons: ['Cara Bayar', 'Bukan Kendaraan Saya']
        },
        {
            keywords: ['bayar', 'briva', 'denda', 'atm', 'transfer'],
            response: "💳 **Cara Pembayaran:**\nSetelah konfirmasi, Anda akan mendapat kode **BRIVA**.\n\nPembayaran bisa via:\n- ATM BRI / Mobile Banking (BRIMO)\n- ATM Bank Lain (Menu Transfer ke Bank Lain)\n- Teller BRI",
            buttons: ['Batas Waktu Bayar', 'Konfirmasi Dulu']
        },
        {
            keywords: ['jual', 'bukan', 'mobil saya', 'motor saya', 'dijual', 'lapor jual'],
            response: "🚗 **Kendaraan Sudah Dijual?**\nJika kendaraan sudah bukan milik Anda tapi surat tilang datang ke Anda:\n\n1. Lakukan Konfirmasi di website ini.\n2. Pilih opsi **'Bukan Kendaraan Saya'** atau **'Kendaraan Sudah Dijual'**.\n3. Upload bukti jual beli jika ada.\n4. Sistem akan memproses pemblokiran STNK sementara agar tidak progresif ke Anda.",
            buttons: ['Cara Konfirmasi']
        },
        {
            keywords: ['konfirmasi', 'lapor', 'sidang'],
            response: "✅ **Tentang Konfirmasi:**\nKonfirmasi bukan berarti mengakui kesalahan saja, tapi juga untuk memberikan klarifikasi (misal: kendaraan dipinjam/dijual).\n\nAnda punya waktu **8 HARI** sejak surat diterima untuk konfirmasi.",
            buttons: ['Batas Waktu', 'Cek Data']
        },
        {
            keywords: ['lokasi', 'kamera', 'cctv', 'dimana'],
            response: "📍 **Lokasi Kamera ETLE:**\nKamera ETLE tersebar di berbagai titik strategis (Lampu merah, jalur busway, jalan protokol).\n\nAnda bisa melihat peta sebaran di menu **'Tentang ETLE' > 'Titik Kamera'**.",
            buttons: []
        },
        {
            keywords: ['penipuan', 'apk', 'wa', 'whatsapp', 'surat', 'palsu'],
            response: "🚨 **HATI-HATI PENIPUAN!** 🚨\nKorlantas/ETLE **TIDAK PERNAH** mengirimkan file **.APK** lewat WhatsApp.\n\nSurat tilang resmi dikirim via **POS** ke alamat STNK. Jika menerima WA mencurigakan mengirim file 'Surat Tilang.apk', JANGAN DIKLIK/DIINSTALL.",
            buttons: ['Hubungi Petugas']
        },
        {
            keywords: ['blokir', 'stnk', 'blokir stnk'],
            response: "🚫 **Blokir STNK Terjadi Jika:**\n1. Anda tidak konfirmasi selama 8 hari.\n2. Anda sudah konfirmasi tapi tidak membayar denda selama 15 hari.\n\nBlokir akan dibuka otomatis setelah Anda membayar denda.",
            buttons: ['Cara Bayar']
        },
        {
            keywords: ['waktu', 'kapan', 'deadline', 'batas'],
            response: "⏳ **Batas Waktu:**\n- Konfirmasi: **8 Hari** dari surat diterima.\n- Pembayaran: **15 Hari** setelah tanggal sidang/verifikasi.\n- Jika lewat, STNK akan terblokir sementara.",
            buttons: ['Cek Data']
        }
    ];

    // --- FORMAT PESAN AWAL ---
    const initialMessage = {
        id: 1,
        text: "Halo! 👋 Saya Asisten Virtual ETLE.\nSaya siap membantu informasi seputar tilang elektronik.\n\nApa yang ingin Anda tanyakan?",
        sender: 'bot',
        type: 'text',
        // Pertanyaan terbanyak (Quick Actions)
        buttons: ['Cara Cek Data', 'Cara Bayar', 'Kendaraan Sudah Dijual', 'Awas Penipuan APK']
    };

    const [messages, setMessages] = useState([initialMessage]);

    // Scroll otomatis ke bawah
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fungsi Logika Jawaban
    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();

        // 1. Cek Greetings
        if (['halo', 'hi', 'hai', 'pagi', 'siang', 'sore', 'malam'].some(word => lowerText.includes(word))) {
            return {
                text: "Halo! Ada yang bisa saya bantu terkait ETLE? Silakan pilih menu di bawah atau ketik pertanyaan Anda.",
                type: 'text',
                buttons: ['Cara Cek Data', 'Cara Bayar']
            };
        }

        // 2. Cek Knowledge Base
        const found = knowledgeBase.find(item =>
            item.keywords.some(keyword => lowerText.includes(keyword))
        );

        if (found) {
            return {
                text: found.response,
                type: 'text',
                buttons: found.buttons
            };
        }

        // 3. Fallback (Tidak Mengerti)
        return {
            text: "Maaf, saya kurang mengerti pertanyaan tersebut. 🙏\n\nCoba gunakan kata kunci lain (contoh: 'bayar', 'lokasi') atau hubungi petugas kami langsung.",
            type: 'fallback',
            buttons: ['Hubungi Petugas']
        };
    };

    // Handler Kirim Pesan Manual
    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        processMessage(input);
        setInput('');
    };

    // Handler Klik Tombol Cepat (Quick Reply)
    const handleQuickReply = (text) => {
        processMessage(text);
    };

    // Proses Pesan (User -> Bot)
    const processMessage = (text) => {
        // 1. Tambah Pesan User
        const userMsg = { id: Date.now(), text: text, sender: 'user', type: 'text' };
        setMessages((prev) => [...prev, userMsg]);

        // 2. Loading Effect (Optional, disini langsung response)
        setTimeout(() => {
            const response = generateResponse(text);
            const botMsg = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                type: response.type,
                buttons: response.buttons || []
            };
            setMessages((prev) => [...prev, botMsg]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">

            {/* Jendela Chat */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <FaRobot className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base">Layanan ETLE</h3>
                                <p className="text-xs text-blue-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online 24 Jam
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Area Pesan */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                                {/* Bubble Chat */}
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm relative ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                    }`}>
                                    {/* Markdown-like rendering (Bold & Newline) */}
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {msg.text.split('**').map((part, i) =>
                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                        )}
                                    </p>

                                    {/* Tombol Khusus Fallback (WA) */}
                                    {msg.type === 'fallback' && (
                                        <a
                                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20ETLE,%20saya%20butuh%20bantuan.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-bold no-underline text-xs"
                                        >
                                            <FaWhatsapp className="text-lg" /> Chat Petugas via WA
                                        </a>
                                    )}
                                </div>

                                {/* Quick Reply Buttons (Chips) */}
                                {msg.sender === 'bot' && msg.buttons && msg.buttons.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                                        {msg.buttons.map((btnText, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuickReply(btnText)}
                                                className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 hover:border-blue-300 transition-all active:scale-95 text-left"
                                            >
                                                {btnText}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 p-2.5 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-sm px-4 text-gray-700 placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                        >
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </form>
                </div>
            )}

            {/* Tombol Pemicu (Floating Button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:bg-blue-700 animate-bounce-slow'} text-white p-4 rounded-full shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-110 flex items-center justify-center group`}
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-2xl" />}

                {/* Tooltip kecil saat tutup */}
                {!isOpen && (
                    <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Butuh Bantuan?
                    </span>
                )}
            </button>
        </div>
    );
}
