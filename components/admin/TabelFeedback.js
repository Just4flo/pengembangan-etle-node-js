// components/admin/TabelFeedback.js
import React from 'react';
import { FaEnvelope, FaClock, FaUser, FaCommentDots } from 'react-icons/fa';

// Helper format tanggal
const formatTanggal = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return '-';
    try {
        return timestamp.toDate().toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
        });
    } catch (e) { return 'Error'; }
};

export default function TabelFeedback({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow border border-slate-200">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-4xl text-blue-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Belum ada pesan masuk</h3>
                <p className="text-slate-500">Feedback dari pengguna akan muncul di sini.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pengirim</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pesan</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 text-sm">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">

                            {/* Kolom 1: Pengirim (Nama & Email) */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{item.nama}</p>
                                        <p className="text-xs text-slate-500">{item.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Kolom 2: Pesan */}
                            <td className="px-6 py-4">
                                <div className="flex items-start gap-2 max-w-md">
                                    <FaCommentDots className="text-gray-400 mt-1 flex-shrink-0" />
                                    <p className="text-slate-700 leading-relaxed line-clamp-2" title={item.pesan}>
                                        {item.pesan}
                                    </p>
                                </div>
                            </td>

                            {/* Kolom 3: Waktu */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <FaClock />
                                    {formatTanggal(item.waktuDibuat)}
                                </div>
                            </td>

                            {/* Kolom 4: Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Baru' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {item.status || 'Baru'}
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}