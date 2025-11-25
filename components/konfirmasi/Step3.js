// components/konfirmasi/Step3.js
import { useState } from 'react';

export default function Step3({ setCurrentStep, setConfirmationData, violationData }) {
    const [statusKendaraan, setStatusKendaraan] = useState('milik-sendiri');
    const [namaPengemudi, setNamaPengemudi] = useState('');
    const [noSim, setNoSim] = useState('');
    const [error, setError] = useState(null);

    // Handler khusus untuk Input SIM
    const handleSimChange = (e) => {
        // Hanya izinkan angka (0-9)
        const value = e.target.value.replace(/[^0-9]/g, '');

        // Batasi maksimal 16 karakter
        if (value.length <= 16) {
            setNoSim(value);
        }
    };

    const handleNext = () => {
        setError(null); // Reset error sebelumnya

        if (statusKendaraan === 'milik-sendiri') {
            // Validasi Nama
            if (!namaPengemudi.trim()) {
                setError("Nama Pengemudi wajib diisi.");
                return;
            }

            // Validasi Nomor SIM (Wajib isi & Harus 16 Angka)
            if (!noSim) {
                setError("Nomor SIM wajib diisi.");
                return;
            }

            if (noSim.length !== 16) {
                setError(`Nomor SIM harus terdiri dari 16 angka. (Saat ini: ${noSim.length})`);
                return;
            }
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
                        <input
                            type="radio"
                            name="status"
                            value="milik-sendiri"
                            checked={statusKendaraan === 'milik-sendiri'}
                            onChange={(e) => setStatusKendaraan(e.target.value)}
                            className="mr-2"
                        />
                        Kendaraan Milik Sendiri
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="sudah-dijual"
                            checked={statusKendaraan === 'sudah-dijual'}
                            onChange={(e) => setStatusKendaraan(e.target.value)}
                            className="mr-2"
                        />
                        Sudah Terjual/Bukan Saya
                    </label>
                </div>
            </div>

            {statusKendaraan === 'milik-sendiri' && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold mb-3 text-gray-800">Data Pengemudi Saat Kejadian</h4>

                    <input
                        type="text"
                        placeholder="Nama Lengkap Pengemudi"
                        value={namaPengemudi}
                        onChange={(e) => setNamaPengemudi(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Nomor SIM (16 Angka)"
                        value={noSim}
                        onChange={handleSimChange}
                        maxLength={16} // HTML validation
                        className="w-full p-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{noSim.length}/16</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm">
                    {error}
                </div>
            )}

            <button onClick={handleNext} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                Lanjut ke Ringkasan
            </button>
        </div>
    );
}