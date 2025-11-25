// components/admin/TabelKendaraan.js
import React from 'react';
import { FaCar, FaIdCard, FaCalendarAlt, FaPalette, FaTachometerAlt, FaEdit, FaTrash } from 'react-icons/fa';

// Helper format tanggal
const formatTanggal = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return '-';
    try {
        return timestamp.toDate().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch (e) { return 'Error'; }
};

// Tambahkan prop 'onDelete'
export default function TabelKendaraan({ data = [], onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow border border-slate-200">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCar className="text-3xl text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Belum ada data kendaraan</h3>
                <p className="text-slate-500">Silakan input data kendaraan baru melalui menu Input Kendaraan.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Identitas Kendaraan</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pemilik</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Spesifikasi</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. Rangka & Mesin</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Masa Berlaku</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200 text-sm">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">

                            {/* Kolom 1: No Polisi & Tipe */}
                            <td className="px-6 py-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
                                        <FaCar />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-slate-800">{item.noPolisi}</p>
                                        <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded mt-1 border border-slate-300">
                                            {item.tipe || 'Kendaraan'}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* Kolom 2: Pemilik */}
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaIdCard className="text-blue-500" />
                                        <span className="font-semibold text-slate-800">{item.namaPemilik}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                                        {item.alamatPemilik}
                                    </p>
                                </div>
                            </td>

                            {/* Kolom 3: Spesifikasi */}
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <p className="font-medium text-slate-800">{item.merk} {item.model}</p>
                                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border">
                                            {item.tahunPembuatan}
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border">
                                            <FaPalette className="text-[10px]" /> {item.warna}
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border">
                                            <FaTachometerAlt className="text-[10px]" /> {item.isiSilinder} cc
                                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* Kolom 4: Rangka & Mesin */}
                            <td className="px-6 py-4">
                                <div className="text-xs space-y-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-[10px]">No. Rangka</span>
                                        <span className="text-slate-700 font-medium">{item.noRangka}</span>
                                    </div>
                                    <div className="flex flex-col border-t border-slate-200 pt-1">
                                        <span className="text-slate-400 text-[10px]">No. Mesin</span>
                                        <span className="text-slate-700 font-medium">{item.noMesin}</span>
                                    </div>
                                </div>
                            </td>

                            {/* Kolom 5: Masa Berlaku */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <FaCalendarAlt className="text-blue-500" />
                                    {formatTanggal(item.berlakuSampai)}
                                </div>
                            </td>

                            {/* Kolom 6: Aksi (Edit & Hapus) */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
                                        title="Edit Data"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item)} // Panggil fungsi onDelete
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                        title="Hapus Data"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}