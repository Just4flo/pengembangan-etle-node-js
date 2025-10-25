// components/konfirmasi/Step3.js
import { useState } from 'react';

export default function Step3({ setCurrentStep, setConfirmationData, violationData }) {
    const [statusKendaraan, setStatusKendaraan] = useState('milik-sendiri');
    const [namaPengemudi, setNamaPengemudi] = useState('');
    const [noSim, setNoSim] = useState('');
    const [error, setError] = useState(null);

    const handleNext = () => {
        if (statusKendaraan === 'milik-sendiri' && (!namaPengemudi || !noSim)) {
            setError("Nama Pengemudi dan No. SIM wajib diisi.");
            return;
        }

        const data = {
            statusKendaraan: statusKendaraan,
            pengemudi: statusKendaraan === 'milik-sendiri' ? { namaPengemudi, noSim } : null,
        };

        // Menyimpan data ke state di parent (konfirmasi/index.js)
        setConfirmationData(data);
        // Pindah ke Step 4
        setCurrentStep(4);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Konfirmasi Kendaraan</h2>

            <div className="mb-6 space-y-3">
                <p className="font-medium text-gray-700">Status Kepemilikan Kendaraan:</p>
                <div className="flex gap-4 text-gray-900">
                    <label className="flex items-center">
                        <input type="radio" name="status" value="milik-sendiri" checked={statusKendaraan === 'milik-sendiri'} onChange={(e) => setStatusKendaraan(e.target.value)} className="mr-2" />
                        Kendaraan Milik Sendiri
                        Sini</label>
                    <label className="flex items-center">
                        <input type="radio" name="status" value="sudah-dijual" checked={statusKendaraan === 'sudah-dijual'} onChange={(e) => setStatusKendaraan(e.target.value)} className="mr-2" />
                        Sudah Terjual/Bukan Saya
                    </label>
                </div>
            </div>

            {statusKendaraan === 'milik-sendiri' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold mb-3 text-gray-800">Data Pengemudi Saat Kejadian</h4>
                    <input type="text" placeholder="Nama Lengkap Pengemudi" value={namaPengemudi} onChange={(e) => setNamaPengemudi(e.target.value)} className="w-full p-2 border rounded-lg mb-3 text-gray-900" required />
                    <input type="text" placeholder="Nomor SIM" value={noSim} onChange={(e) => setNoSim(e.target.value)} className="w-full p-2 border rounded-lg text-gray-900" required />
                </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button onClick={handleNext} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
                Lanjut ke Ringkasan
            </button>
        </div>
    );
}