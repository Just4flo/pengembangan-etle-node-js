// components/Chatbot.js
import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot, FaUser, FaWhatsapp } from 'react-icons/fa';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    // Format pesan sekarang: { id, text, sender, type }
    // type: 'text' (biasa) atau 'fallback' (tidak mengerti)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Halo! 👋 Saya asisten virtual ETLE Korlantas. Ada yang bisa saya bantu? (Ketik: 'Cek Data', 'Cara Bayar', atau 'Lokasi')",
            sender: 'bot',
            type: 'text'
        }
    ]);
    const messagesEndRef = useRef(null);

    // GANTI NOMOR INI dengan nomor WhatsApp Official Korlantas/Posko Anda
    // Format: kode negara (62) tanpa tanda +
    const WHATSAPP_NUMBER = "6281901500669";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Logika Bot
    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('cek') || lowerText.includes('data')) {
            return { text: "Untuk mengecek data pelanggaran, silakan buka menu 'Cek Data' di navbar atas, lalu masukkan No Polisi, No Rangka, dan No Mesin.", type: 'text' };
        }
        if (lowerText.includes('bayar') || lowerText.includes('briva')) {
            return { text: "Pembayaran denda dapat dilakukan melalui BRIVA (BRI Virtual Account). Kode pembayaran akan muncul setelah Anda melakukan konfirmasi di menu 'Konfirmasi'.", type: 'text' };
        }
        if (lowerText.includes('lokasi') || lowerText.includes('kamera')) {
            return { text: "Anda bisa melihat titik lokasi kamera ETLE di menu 'Tentang ETLE' -> 'Posko ETLE'.", type: 'text' };
        }
        if (lowerText.includes('halo') || lowerText.includes('hi') || lowerText.includes('pagi') || lowerText.includes('siang')) {
            return { text: "Halo! Ada yang bisa saya bantu terkait ETLE?", type: 'text' };
        }
        if (lowerText.includes('konfirmasi')) {
            return { text: "Konfirmasi pelanggaran wajib dilakukan maksimal 8 hari setelah surat diterima. Buka menu 'Konfirmasi' untuk melapor.", type: 'text' };
        }

        // --- JIKA TIDAK MENGERTI (FALLBACK) ---
        return {
            text: "Maaf, saya kurang mengerti pertanyaan Anda. 🙏\n\nSilakan hubungi petugas kami langsung via WhatsApp untuk bantuan lebih lanjut.",
            type: 'fallback' // Menandakan ini butuh tombol WA
        };
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Pesan User
        const userMsg = { id: Date.now(), text: input, sender: 'user', type: 'text' };
        setMessages((prev) => [...prev, userMsg]);
        const userInput = input;
        setInput('');

        // 2. Respon Bot
        setTimeout(() => {
            const response = generateResponse(userInput);
            const botMsg = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'bot',
                type: response.type
            };
            setMessages((prev) => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Jendela Chat */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <FaRobot className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asisten ETLE</h3>
                                <p className="text-xs text-blue-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded text-white transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Area Pesan */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                    }`}>
                                    {/* Teks Pesan (dengan white-space: pre-wrap agar enter terbaca) */}
                                    <p className="whitespace-pre-wrap">{msg.text}</p>

                                    {/* --- TOMBOL WHATSAPP (Jika tipe fallback) --- */}
                                    {msg.type === 'fallback' && (
                                        <a
                                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20ETLE,%20saya%20butuh%20bantuan.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-bold no-underline"
                                        >
                                            <FaWhatsapp className="text-lg" /> Hubungi Petugas
                                        </a>
                                    )}

                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm px-4 text-black"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0">
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </form>
                </div>
            )}

            {/* Tombol Pemicu (Floating Button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center`}
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-2xl" />}
            </button>
        </div>
    );
}