// pages/admin/data-kendaraan.js

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../config/firebase';
import { collection, getDocs, query, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import TabelKendaraan from '../../components/admin/tabel-kendaraan';
import { FaSpinner, FaDatabase, FaTimes, FaSave, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';

// --- DATA KONSTANTA ---
const VEHICLE_TYPES = [
    { value: 'Motor', label: 'Sepeda Motor (Roda 2)' },
    { value: 'Mobil', label: 'Mobil (Roda 4+)' }
];

const BRAND_OPTIONS = {
    'Motor': ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki'],
    'Mobil': ['Toyota', 'Daihatsu', 'Honda', 'Mitsubishi Motors', 'Suzuki', 'Wuling', 'Hyundai']
};

const TYPE_OPTIONS = {
    'Motor': ['Matic (Skutik)', 'Bebek', 'Sport (Naked & Fairing)', 'Trail / Off-road', 'Klasik / Retro', 'Cruiser / Moge', 'Motor Roda Tiga (Motor Niaga)', 'Motor Listrik'],
    'Mobil': ['MPV', 'SUV', 'Hatchback / City Car', 'Sedan', 'Double Cabin', 'Coupe (Mobil Sport 2 Pintu)', 'Convertible (Atap Terbuka)', 'Mobil Listrik', 'Minibus / Microbus (Elf/HiAce)', 'Pick-up', 'Blind Van', 'Bus', 'Truk Box', 'Truk Bak Terbuka', 'Truk Tangki', 'Dump Truck', 'Truk Towing / Derek', 'Truk Trailer / Kontainer']
};

export default function DataKendaraanPage() {
    const [vehicleList, setVehicleList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // State Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fungsi Fetch Data
    const fetchVehicles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const vehiclesRef = collection(db, 'kendaraan');
            const q = query(vehiclesRef);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVehicleList(data);
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError("Gagal mengambil data dari server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // --- HANDLER EDIT ---
    const handleEditClick = (vehicle) => {
        let dateStr = '';
        if (vehicle.berlakuSampai && typeof vehicle.berlakuSampai.toDate === 'function') {
            dateStr = vehicle.berlakuSampai.toDate().toISOString().split('T')[0];
        }
        setEditFormData({ ...vehicle, berlakuSampaiDate: dateStr });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // 1. Sanitasi Input Real-time (Hanya Huruf & Angka, Uppercase)
        if (['noRangka', 'noMesin'].includes(name)) {
            processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        }

        // Reset Merk/Tipe jika Jenis berubah
        if (name === 'jenisKendaraan') {
            setEditFormData(prev => ({
                ...prev,
                [name]: processedValue,
                merk: '',
                tipe: ''
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        }
    };

    // 2. Fungsi Validasi Ketat
<<<<<<< HEAD
    const validateEditForm = () => {
        // Validasi No Rangka (Tepat 17)
        if (editFormData.noRangka.length !== 17) {
            alert(`No. Rangka harus tepat 17 karakter. (Saat ini: ${editFormData.noRangka.length})`);
            return false;
        }
        // Validasi No Mesin (10-14)
        if (editFormData.noMesin.length < 10 || editFormData.noMesin.length > 14) {
            alert(`No. Mesin harus antara 10 sampai 14 karakter. (Saat ini: ${editFormData.noMesin.length})`);
            return false;
        }
        
        // Validasi Field Kosong
        if (!editFormData.namaPemilik || !editFormData.merk || !editFormData.tipe) {
            alert("Semua field wajib diisi.");
            return false;
        }
        return true;
    };
=======
// 2. Fungsi Validasi Ketat
const validateEditForm = () => {
    // Validasi No Rangka (Tepat 17)
    if (editFormData.noRangka.length !== 17) {
        alert(`No. Rangka harus tepat 17 karakter. (Saat ini: ${editFormData.noRangka.length})`);
        return false;
    }
    // Validasi No Mesin (10-14)
    if (editFormData.noMesin.length < 10 || editFormData.noMesin.length > 14) {
        alert(`No. Mesin harus antara 10 sampai 14 karakter. (Saat ini: ${editFormData.noMesin.length})`);
        return false;
    }
    
    // Validasi Isi Silinder (Minimal 50)
    if (editFormData.isiSilinder && editFormData.isiSilinder < 50) {
        alert("Isi silinder minimal 50 cc");
        return false;
    }
    
    // Validasi Field Kosong
    if (!editFormData.namaPemilik || !editFormData.merk || !editFormData.tipe) {
        alert("Semua field wajib diisi.");
        return false;
    }
    return true;
};
>>>>>>> 76ad91d76cd39ce94b73a1febdffc40dcebe9a6a

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Jalankan validasi sebelum submit
        if (!validateEditForm()) return;

        setIsUpdating(true);
        try {
            const vehicleRef = doc(db, 'kendaraan', editFormData.id);
            const newTimestamp = editFormData.berlakuSampaiDate
                ? Timestamp.fromDate(new Date(editFormData.berlakuSampaiDate))
                : editFormData.berlakuSampai;

            await updateDoc(vehicleRef, {
                namaPemilik: editFormData.namaPemilik,
                alamatPemilik: editFormData.alamatPemilik,
                jenisKendaraan: editFormData.jenisKendaraan,
                merk: editFormData.merk,
                model: editFormData.model,
                tipe: editFormData.tipe,
                warna: editFormData.warna,
                tahunPembuatan: Number(editFormData.tahunPembuatan),
                isiSilinder: Number(editFormData.isiSilinder),
                noRangka: editFormData.noRangka,
                noMesin: editFormData.noMesin,
                berlakuSampai: newTimestamp
            });

            alert('Data berhasil diperbarui!');
            setIsEditModalOpen(false);
            fetchVehicles();
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Gagal memperbarui data.");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- HANDLER DELETE ---
    const handleDeleteClick = (vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!vehicleToDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'kendaraan', vehicleToDelete.id));
            alert(`Data kendaraan ${vehicleToDelete.noPolisi} berhasil dihapus.`);
            setIsDeleteModalOpen(false);
            fetchVehicles();
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Gagal menghapus data.");
        } finally {
            setIsDeleting(false);
            setVehicleToDelete(null);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full mx-auto relative">
                {/* Header Halaman */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <FaDatabase className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Master Data Kendaraan</h1>
                            <p className="text-slate-500 text-sm">Database lengkap kendaraan yang terdaftar.</p>
                        </div>
                    </div>

                    {!isLoading && !error && (
                        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="text-sm text-slate-500">Total Kendaraan</span>
                            <span className="text-2xl font-bold text-blue-600">{vehicleList.length}</span>
                        </div>
                    )}
                </div>

                {/* Loading & Error States */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
                        <span className="text-slate-600 font-medium">Menghubungkan ke database...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r text-red-700 mb-6 shadow-sm">
                        <p className="font-bold">Terjadi Kesalahan</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Data Table */}
                {!isLoading && !error && (
                    <TabelKendaraan
                        data={vehicleList}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                )}

                {/* --- MODAL EDIT --- */}
                {isEditModalOpen && editFormData && (
                    // PERBAIKAN 1: Backdrop lebih transparan (bg-black/30) agar belakang terlihat
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-up border border-gray-200">
                            <div className="bg-blue-600 p-4 flex justify-between items-center sticky top-0 z-10">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <FaSave className="text-blue-200" /> Edit Data Kendaraan
                                </h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:text-gray-200">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="p-6 space-y-4">
                                {/* Info Readonly */}
                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800 mb-4">
                                    <strong>No. Polisi:</strong> {editFormData.noPolisi} (ID Unik - Tidak dapat diubah)
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* PERBAIKAN 2: Semua input menggunakan text-gray-900 (Hitam) */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik</label>
                                        <input type="text" name="namaPemilik" value={editFormData.namaPemilik} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pemilik</label>
                                        <input type="text" name="alamatPemilik" value={editFormData.alamatPemilik} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required />
                                    </div>

                                    {/* Dropdown Jenis */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                                        <select name="jenisKendaraan" value={editFormData.jenisKendaraan} onChange={handleEditChange} className="w-full p-2 border rounded bg-white text-gray-900">
                                            {VEHICLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>

                                    {/* Dropdown Merk */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Merk</label>
                                        <select name="merk" value={editFormData.merk} onChange={handleEditChange} className="w-full p-2 border rounded bg-white text-gray-900" disabled={!editFormData.jenisKendaraan}>
                                            <option value="">Pilih Merk</option>
                                            {editFormData.jenisKendaraan && BRAND_OPTIONS[editFormData.jenisKendaraan]?.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>

                                    {/* Dropdown Tipe */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                        <select name="tipe" value={editFormData.tipe} onChange={handleEditChange} className="w-full p-2 border rounded bg-white text-gray-900" disabled={!editFormData.jenisKendaraan}>
                                            <option value="">Pilih Tipe</option>
                                            {editFormData.jenisKendaraan && TYPE_OPTIONS[editFormData.jenisKendaraan]?.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Model</label><input type="text" name="model" value={editFormData.model} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Warna</label><input type="text" name="warna" value={editFormData.warna} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label><input type="number" name="tahunPembuatan" value={editFormData.tahunPembuatan} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required /></div>
                                   <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
    <input 
        type="number" 
        name="isiSilinder" 
        value={editFormData.isiSilinder} 
        onChange={handleEditChange} 
        className="w-full p-2 border rounded text-gray-900" 
        min="50"
        required 
    />
</div>
                                    {/* No Rangka & Mesin (Dengan Validasi Panjang) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Rangka (17 Karakter)</label>
                                        <input type="text" name="noRangka" value={editFormData.noRangka} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900 font-mono" required maxLength={17} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Mesin (10-14 Karakter)</label>
                                        <input type="text" name="noMesin" value={editFormData.noMesin} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900 font-mono" required maxLength={14} />
                                    </div>

                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Masa Berlaku</label><input type="date" name="berlakuSampaiDate" value={editFormData.berlakuSampaiDate} onChange={handleEditChange} className="w-full p-2 border rounded text-gray-900" required /></div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Batal</button>
                                    <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400">{isUpdating ? <FaSpinner className="animate-spin" /> : <FaSave />} Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- MODAL DELETE --- */}
                {isDeleteModalOpen && vehicleToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up border border-gray-200">
                            <div className="text-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaExclamationTriangle className="text-3xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Data?</h3>
                                <p className="text-gray-500 text-sm mb-6">Anda yakin ingin menghapus data <strong>{vehicleToDelete.noPolisi}</strong>?</p>
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Batal</button>
                                    <button onClick={confirmDelete} disabled={isDeleting} className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">{isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />} Hapus</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
