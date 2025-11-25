// pages/admin/input-kendaraan.js

import { useState, useRef, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from '../../components/admin/AdminLayout';

// Impor ikon
import {
    FaCar, FaCog, FaUser, FaRoad, FaCalendarAlt,
    FaPalette, FaHashtag, FaPlus, FaTachometerAlt,
    FaSpinner, FaMotorcycle, FaList, FaLayerGroup, FaExclamationCircle
} from 'react-icons/fa';

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
    'Motor': [
        'Matic (Skutik)', 'Bebek', 'Sport (Naked & Fairing)', 'Trail / Off-road',
        'Klasik / Retro', 'Cruiser / Moge', 'Motor Roda Tiga (Motor Niaga)', 'Motor Listrik'
    ],
    'Mobil': [
        'MPV', 'SUV', 'Hatchback / City Car', 'Sedan', 'Double Cabin',
        'Coupe (Mobil Sport 2 Pintu)', 'Convertible (Atap Terbuka)', 'Mobil Listrik',
        'Minibus / Microbus (Elf/HiAce)', 'Pick-up', 'Blind Van', 'Bus',
        'Truk Box', 'Truk Bak Terbuka', 'Truk Tangki', 'Dump Truck',
        'Truk Towing / Derek', 'Truk Trailer / Kontainer'
    ]
};

// --- KOMPONEN INPUT FIELD (DENGAN VISUAL ERROR) ---
const InputField = ({ icon: Icon, id, placeholder, value, type = 'text', inputRef, onKeyDown, onChange, error, ...props }) => (
    <div className="relative">
        {Icon && <Icon className={`absolute top-3.5 left-4 ${error ? 'text-red-400' : 'text-slate-400'}`} />}
        <input
            ref={inputRef}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`w-full p-3 ${Icon ? 'pl-12' : 'pl-3'} border rounded-lg outline-none transition-colors 
                ${error
                    ? 'border-red-500 bg-red-50 text-slate-900 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
            required
            {...props}
        />
        {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {error}
            </p>
        )}
    </div>
);

// --- KOMPONEN SELECT FIELD (DENGAN VISUAL ERROR) ---
const SelectField = ({ icon: Icon, id, value, inputRef, onKeyDown, onChange, children, error, ...props }) => (
    <div className="relative">
        {Icon && <Icon className={`absolute top-3.5 left-4 ${error ? 'text-red-400' : 'text-slate-400'}`} />}
        <select
            ref={inputRef}
            id={id}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={`w-full p-3 pl-12 border rounded-lg outline-none transition-colors bg-white
                ${error
                    ? 'border-red-500 bg-red-50 text-slate-900 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                } disabled:bg-slate-100 disabled:text-slate-400`}
            required
            {...props}
        >
            {children}
        </select>
        {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FaExclamationCircle /> {error}
            </p>
        )}
    </div>
);

export default function InputKendaraanPage() {
    const [formData, setFormData] = useState({
        noPolisi: '', noRangka: '', noMesin: '', namaPemilik: '', alamatPemilik: '',
        jenisKendaraan: '', merk: '', model: '', tipe: '', warna: '',
        tahunPembuatan: '', isiSilinder: '', berlakuSampai: ''
    });

    // State untuk Error Validasi
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Refs
    const noPolisiRef = useRef(null);
    const noRangkaRef = useRef(null);
    const noMesinRef = useRef(null);
    const namaPemilikRef = useRef(null);
    const alamatPemilikRef = useRef(null);
    const jenisKendaraanRef = useRef(null);
    const merkRef = useRef(null);
    const modelRef = useRef(null);
    const tipeRef = useRef(null);
    const warnaRef = useRef(null);
    const tahunPembuatanRef = useRef(null);
    const isiSilinderRef = useRef(null);
    const berlakuSampaiRef = useRef(null);

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            if (noPolisiRef.current) noPolisiRef.current.focus();
        });
        return () => cancelAnimationFrame(rafId);
    }, []);

    const handleKeyDown = (e, nextFieldRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextFieldRef && nextFieldRef.current) {
                nextFieldRef.current.focus();
            }
        }
    };

    // --- VALIDASI FIELD INDIVIDUAL ---
    const validateField = (id, value) => {
        let errorMsg = '';

        switch (id) {
            case 'noPolisi':
                if (value.length > 0 && (value.length < 4 || value.length > 9)) errorMsg = '4-9 Karakter';
                break;
            case 'noRangka':
                if (value.length > 0 && value.length !== 17) errorMsg = `Wajib 17 Karakter (Saat ini: ${value.length})`;
                break;
            case 'noMesin':
                if (value.length > 0 && (value.length < 10 || value.length > 14)) errorMsg = '10-14 Karakter';
                break;
            case 'tahunPembuatan':
                if (value && (value < 1950 || value > new Date().getFullYear() + 1)) errorMsg = 'Tahun tidak valid';
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [id]: errorMsg }));
        return errorMsg === '';
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        let updatedFormData = { ...formData };
        let processedValue = value;

        if (['noPolisi', 'noRangka', 'noMesin'].includes(id)) {
            processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        }

        updatedFormData[id] = processedValue;

        if (id === 'jenisKendaraan') {
            updatedFormData['merk'] = '';
            updatedFormData['tipe'] = '';
        }

        setFormData(updatedFormData);

        // Jalankan validasi saat mengetik
        validateField(id, processedValue);
    };

    // Validasi Menyeluruh sebelum Submit
    const isFormValid = () => {
        const newErrors = {};
        let isValid = true;

        // Cek Format
        if (formData.noPolisi.length < 4 || formData.noPolisi.length > 9) { newErrors.noPolisi = '4-9 Karakter'; isValid = false; }
        if (formData.noRangka.length !== 17) { newErrors.noRangka = 'Wajib 17 Karakter'; isValid = false; }
        if (formData.noMesin.length < 10 || formData.noMesin.length > 14) { newErrors.noMesin = '10-14 Karakter'; isValid = false; }

        // Cek Kosong (Required Fields)
        Object.keys(formData).forEach(key => {
            if (!formData[key] && !newErrors[key]) {
                newErrors[key] = 'Wajib diisi';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!isFormValid()) {
            setMessage({ type: 'error', text: 'Harap perbaiki kolom yang berwarna merah.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const dateObj = new Date(formData.berlakuSampai);
            if (isNaN(dateObj.getTime())) throw new Error("Tanggal berlaku tidak valid");

            const dataToSave = {
                ...formData,
                tahunPembuatan: Number(formData.tahunPembuatan),
                isiSilinder: Number(formData.isiSilinder),
                berlakuSampai: Timestamp.fromDate(dateObj),
                createdAt: Timestamp.now()
            };

            await setDoc(doc(db, 'kendaraan', dataToSave.noPolisi), dataToSave);

            setMessage({ type: 'success', text: `Data kendaraan ${dataToSave.noPolisi} berhasil ditambahkan!` });

            setFormData({
                noPolisi: '', noRangka: '', noMesin: '', namaPemilik: '', alamatPemilik: '',
                jenisKendaraan: '', merk: '', model: '', tipe: '', warna: '',
                tahunPembuatan: '', isiSilinder: '', berlakuSampai: ''
            });
            setErrors({}); // Reset error

            setTimeout(() => {
                if (noPolisiRef.current) noPolisiRef.current.focus();
            }, 100);

        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage({ type: 'error', text: `Terjadi kesalahan: ${error.message}` });
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
                    <p className="text-sm text-blue-600 mt-1">Gunakan <kbd className="px-2 py-1 bg-slate-100 rounded">Tab</kbd> atau <kbd className="px-2 py-1 bg-slate-100 rounded">Enter</kbd> untuk berpindah field</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message.text && (
                        <div className={`p-3 rounded-lg text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <InputField
                            icon={FaCar}
                            id="noPolisi"
                            placeholder="No. Polisi (4-9 Karakter)"
                            value={formData.noPolisi}
                            inputRef={noPolisiRef}
                            onKeyDown={(e) => handleKeyDown(e, noRangkaRef)}
                            onChange={handleInputChange}
                            maxLength={9}
                            error={errors.noPolisi}
                        />

                        <InputField
                            icon={FaHashtag}
                            id="noRangka"
                            placeholder="No. Rangka (17 Karakter)"
                            value={formData.noRangka}
                            inputRef={noRangkaRef}
                            onKeyDown={(e) => handleKeyDown(e, noMesinRef)}
                            onChange={handleInputChange}
                            maxLength={17}
                            error={errors.noRangka}
                        />

                        <InputField
                            icon={FaCog}
                            id="noMesin"
                            placeholder="No. Mesin (10-14 Karakter)"
                            value={formData.noMesin}
                            inputRef={noMesinRef}
                            onKeyDown={(e) => handleKeyDown(e, namaPemilikRef)}
                            onChange={handleInputChange}
                            maxLength={14}
                            error={errors.noMesin}
                        />

                        <InputField
                            icon={FaUser}
                            id="namaPemilik"
                            placeholder="Nama Pemilik"
                            value={formData.namaPemilik}
                            inputRef={namaPemilikRef}
                            onKeyDown={(e) => handleKeyDown(e, alamatPemilikRef)}
                            onChange={handleInputChange}
                            error={errors.namaPemilik}
                        />

                        <InputField
                            icon={FaRoad}
                            id="alamatPemilik"
                            placeholder="Alamat Pemilik"
                            value={formData.alamatPemilik}
                            inputRef={alamatPemilikRef}
                            onKeyDown={(e) => handleKeyDown(e, jenisKendaraanRef)}
                            onChange={handleInputChange}
                            error={errors.alamatPemilik}
                        />

                        <SelectField
                            icon={FaList}
                            id="jenisKendaraan"
                            value={formData.jenisKendaraan}
                            inputRef={jenisKendaraanRef}
                            onKeyDown={(e) => handleKeyDown(e, merkRef)}
                            onChange={handleInputChange}
                            error={errors.jenisKendaraan}
                        >
                            <option value="" disabled>Pilih Jenis Kendaraan</option>
                            {VEHICLE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </SelectField>

                        <SelectField
                            icon={formData.jenisKendaraan === 'Motor' ? FaMotorcycle : FaCar}
                            id="merk"
                            value={formData.merk}
                            inputRef={merkRef}
                            onKeyDown={(e) => handleKeyDown(e, modelRef)}
                            onChange={handleInputChange}
                            disabled={!formData.jenisKendaraan}
                            error={errors.merk}
                        >
                            <option value="" disabled>
                                {formData.jenisKendaraan ? "Pilih Merk Kendaraan" : "Pilih Jenis Kendaraan Dahulu"}
                            </option>
                            {formData.jenisKendaraan && BRAND_OPTIONS[formData.jenisKendaraan].map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </SelectField>

                        <InputField
                            id="model"
                            placeholder="Model (Contoh: Avanza / Beat)"
                            value={formData.model}
                            inputRef={modelRef}
                            onKeyDown={(e) => handleKeyDown(e, tipeRef)}
                            onChange={handleInputChange}
                            error={errors.model}
                        />

                        <SelectField
                            icon={FaLayerGroup}
                            id="tipe"
                            value={formData.tipe}
                            inputRef={tipeRef}
                            onKeyDown={(e) => handleKeyDown(e, warnaRef)}
                            onChange={handleInputChange}
                            disabled={!formData.jenisKendaraan}
                            error={errors.tipe}
                        >
                            <option value="" disabled>
                                {formData.jenisKendaraan ? "Pilih Tipe Kendaraan" : "Pilih Jenis Kendaraan Dahulu"}
                            </option>
                            {formData.jenisKendaraan && TYPE_OPTIONS[formData.jenisKendaraan].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </SelectField>

                        <InputField
                            icon={FaPalette}
                            id="warna"
                            placeholder="Warna Kendaraan"
                            value={formData.warna}
                            inputRef={warnaRef}
                            onKeyDown={(e) => handleKeyDown(e, tahunPembuatanRef)}
                            onChange={handleInputChange}
                            error={errors.warna}
                        />

                        <InputField
                            icon={FaCalendarAlt}
                            id="tahunPembuatan"
                            type="number"
                            placeholder="Tahun Pembuatan"
                            value={formData.tahunPembuatan}
                            inputRef={tahunPembuatanRef}
                            onKeyDown={(e) => handleKeyDown(e, isiSilinderRef)}
                            onChange={handleInputChange}
                            min="1950"
                            max={new Date().getFullYear() + 1}
                            error={errors.tahunPembuatan}
                        />

                        <InputField
                            icon={FaTachometerAlt}
                            id="isiSilinder"
                            type="number"
                            placeholder="Isi Silinder (cc)"
                            value={formData.isiSilinder}
                            inputRef={isiSilinderRef}
                            onKeyDown={(e) => handleKeyDown(e, berlakuSampaiRef)}
                            onChange={handleInputChange}
                            min="50"
                            max="10000"
                            error={errors.isiSilinder}
                        />

                        <div className="relative md:col-span-2">
                            <label htmlFor="berlakuSampai" className="block text-sm font-medium text-slate-500 mb-1">
                                Berlaku Sampai (Masa STNK)
                            </label>
                            <InputField
                                id="berlakuSampai"
                                type="date"
                                value={formData.berlakuSampai}
                                inputRef={berlakuSampaiRef}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                onChange={handleInputChange}
                                error={errors.berlakuSampai}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                        {isLoading ? 'Menyimpan...' : 'Simpan Data Kendaraan'}
                    </button>

                    <div className="text-center text-xs text-slate-400">
                        Pastikan semua kolom bertanda merah telah diperbaiki sebelum menyimpan.
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}