import { useState } from 'react';

export default function Step3({ setCurrentStep, setConfirmationData }) {
    const [driverType, setDriverType] = useState('pemilik');
    const [otherDriverName, setOtherDriverName] = useState('');
    const handleNext = () => {
        const data = { driverType, otherDriverName: driverType === 'orangLain' ? otherDriverName : null };
        setConfirmationData(data);
        setCurrentStep(4);
    };
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Konfirmasi Pengemudi</h3>
            <p className="text-slate-500 mt-1 mb-6">Silakan konfirmasi siapa yang mengemudikan kendaraan pada saat pelanggaran terjadi.</p>
            <div className="space-y-4">
                <div className="flex items-center">
                    <input id="pemilik" name="driverType" type="radio" checked={driverType === 'pemilik'} onChange={() => setDriverType('pemilik')} className="h-4 w-4 text-blue-600 border-gray-300" />
                    <label htmlFor="pemilik" className="ml-3 block text-sm font-medium text-slate-900">Saya (Pemilik Kendaraan Sesuai STNK)</label>
                </div>
                <div className="flex items-center">
                    <input id="orangLain" name="driverType" type="radio" checked={driverType === 'orangLain'} onChange={() => setDriverType('orangLain')} className="h-4 w-4 text-blue-600 border-gray-300" />
                    <label htmlFor="orangLain" className="ml-3 block text-sm font-medium text-slate-900">Orang Lain</label>
                </div>
                {driverType === 'orangLain' && (
                    <div className="pl-7 mt-4">
                        <label htmlFor="otherDriverName" className="block text-sm font-medium text-slate-700">Nama Pengemudi Lain</label>
                        <input type="text" id="otherDriverName" value={otherDriverName} onChange={(e) => setOtherDriverName(e.target.value)} placeholder="Masukkan nama pengemudi" className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-900" required />
                    </div>
                )}
            </div>
            <button onClick={handleNext} className="mt-8 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Lanjut ke Ringkasan</button>
        </div>
    );
}