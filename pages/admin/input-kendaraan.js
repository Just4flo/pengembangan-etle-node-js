import { useState } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';

// Import icons
import { FaCar, FaCog, FaUser, FaRoad, FaCalendarAlt, FaPalette, FaHashtag, FaPlus, FaTachometerAlt } from 'react-icons/fa';

export default function InputKendaraanPage() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', namaPemilik: '', alamatPemilik: '',
        merk: '', model: '', tipe: '', warna: '', tahunPembuatan: '', isiSilinder: '', berlakuSampai: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const processedValue = id === 'noPolisi' ? value.toUpperCase() : value;
        setFormData({ ...formData, [id]: processedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const dataToSave = {
                ...formData,
                tahunPembuatan: Number(formData.tahunPembuatan),
                isiSilinder: Number(formData.isiSilinder),
                berlakuSampai: Timestamp.fromDate(new Date(formData.berlakuSampai)),
            };

            await setDoc(doc(db, 'kendaraan', formData.noPolisi), dataToSave);

            setMessage({ type: 'success', text: `Data kendaraan ${formData.noPolisi} berhasil ditambahkan!` });
            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', namaPemilik: '', alamatPemilik: '',
                merk: '', model: '', tipe: '', warna: '', tahunPembuatan: '', isiSilinder: '', berlakuSampai: ''
            });

        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Input Data Master Kendaraan</h2>
                    <p className="text-slate-500 mt-2">Masukkan data kendaraan sesuai dengan yang tertera di STNK.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <FaCar className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noPolisi" value={formData.noPolisi} onChange={handleInputChange} placeholder="No. Polisi" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaHashtag className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noRangka" value={formData.noRangka} onChange={handleInputChange} placeholder="No. Rangka" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative md:col-span-2">
                            <FaCog className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="noMesin" value={formData.noMesin} onChange={handleInputChange} placeholder="No. Mesin" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>

                        <div className="relative">
                            <FaUser className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="namaPemilik" value={formData.namaPemilik} onChange={handleInputChange} placeholder="Nama Pemilik" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaRoad className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="alamatPemilik" value={formData.alamatPemilik} onChange={handleInputChange} placeholder="Alamat Pemilik" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>

                        <div className="relative">
                            <input id="merk" value={formData.merk} onChange={handleInputChange} placeholder="Merk (Contoh: Toyota)" className="w-full p-3 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <input id="model" value={formData.model} onChange={handleInputChange} placeholder="Model (Contoh: Avanza)" className="w-full p-3 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <input id="tipe" value={formData.tipe} onChange={handleInputChange} placeholder="Tipe (Contoh: Minibus)" className="w-full p-3 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaPalette className="absolute top-3.5 left-4 text-slate-400" />
                            <input id="warna" value={formData.warna} onChange={handleInputChange} placeholder="Warna" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaCalendarAlt className="absolute top-3.5 left-4 text-slate-400" />
                            <input type="number" id="tahunPembuatan" value={formData.tahunPembuatan} onChange={handleInputChange} placeholder="Tahun Pembuatan" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative">
                            <FaTachometerAlt className="absolute top-3.5 left-4 text-slate-400" />
                            <input type="number" id="isiSilinder" value={formData.isiSilinder} onChange={handleInputChange} placeholder="Isi Silinder (cc)" className="w-full p-3 pl-12 border rounded-lg text-slate-900" required />
                        </div>
                        <div className="relative md:col-span-2">
                            <label htmlFor="berlakuSampai" className="block text-sm font-medium text-slate-500 mb-1">Berlaku Sampai</label>
                            <input type="date" id="berlakuSampai" value={formData.berlakuSampai} onChange={handleInputChange} className="w-full p-3 border rounded-lg text-slate-900" required />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors">
                        <FaPlus />
                        {isLoading ? 'Menyimpan...' : 'Simpan Data Kendaraan'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}