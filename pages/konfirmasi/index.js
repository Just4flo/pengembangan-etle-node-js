// pages/konfirmasi/index.js
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Step1 from '../../components/konfirmasi/Step1';
import Step2 from '../../components/konfirmasi/Step2';
import Step3 from '../../components/konfirmasi/Step3';
import Step4 from '../../components/konfirmasi/Step4';
import Step5 from '../../components/konfirmasi/Step5';
// Pastikan path ini benar:
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Komponen Stepper (tetap sama)
const Stepper = ({ currentStep }) => {
    const steps = ['Konfirmasi Pelanggaran', 'Status Pelanggaran', 'Konfirmasi Kendaraan', 'Ringkasan', 'Pembayaran'];
    return (
        <div className="flex flex-wrap border-b mb-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                return (
                    <div key={stepNumber} className={`py-2 px-4 text-sm font-medium text-center ${isActive ? 'border-b-2 border-blue-600 text-blue-600' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className={`mr-2 px-2 py-1 rounded-full ${isActive || isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {stepNumber}
                        </span>
                        {step}
                    </div>
                );
            })}
        </div>
    );
};

export default function KonfirmasiPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({ noReferensi: '', noPolisi: '' });
    const [violationData, setViolationData] = useState(null);
    const [confirmationData, setConfirmationData] = useState(null); // Data konfirmasi pengemudi
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Asumsi Kode BRIVA dibuat di sini dan diteruskan ke Step 5
    const [brivaNumber, setBrivaNumber] = useState(null);

    // --- LOGIC UTAMA: CEK DATA FIREBASE (STEP 1) ---
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Pastikan Anda sudah membuat index di Firebase untuk query ini!
            const pelanggaranRef = collection(db, 'pelanggaran');
            const q = query(pelanggaranRef,
                where("noReferensi", "==", formData.noReferensi.trim()),
                where("noPolisi", "==", formData.noPolisi.trim().toUpperCase())
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const foundData = querySnapshot.docs[0].data();
                setViolationData(foundData);
                // Set BRIVA Number saat data ditemukan
                setBrivaNumber(`88755${Math.floor(Math.random() * 90000000) + 10000000}`);
                setCurrentStep(2); // Pindah ke Status Pelanggaran
            } else {
                setMessage('Data tidak ditemukan. Pastikan No. Referensi dan No. Polisi benar.');
            }
        } catch (error) {
            console.error("Error mencari data:", error);
            setMessage('Terjadi kesalahan koneksi.');
        } finally {
            setIsLoading(false);
        }
    };
    // ---------------------------------------------------------------------------------


    // --- LOGIC FINAL SUBMIT (STEP 4) ---
    const handleFinalSubmit = async () => {
        if (!violationData) return;
        try {
            // Update status pelanggaran menjadi 'Menunggu Pembayaran'
            const docRef = doc(db, 'pelanggaran', violationData.noPolisi); // Asumsi doc ID = NoPolisi
            await updateDoc(docRef, {
                status: 'Menunggu Pembayaran',
                confirmationData: confirmationData, // Simpan data konfirmasi pengemudi/kendaraan
                brivaCode: brivaNumber, // Simpan kode BRIVA yang diterbitkan
                tanggalKonfirmasi: new Date()
            });
            setCurrentStep(5); // Pindah ke Pembayaran
        } catch (error) {
            console.error("Error updating status: ", error);
            alert("Gagal menyimpan konfirmasi. Silakan coba lagi.");
        }
    };
    // ---------------------------------------------------------------------------------

    // --- LOGIC PEMBAYARAN SUKSES (DIPICU DARI STEP 5) ---
    const handleSuccessfulPayment = async () => {
        if (!violationData) throw new Error("Data pelanggaran tidak valid.");

        // Simulasikan Cek Status Pembayaran (Nyata: Cek API BRIVA)
        // Jika status LUNAS, jalankan operasi Firestore:
        try {
            const originalDocRef = doc(db, 'pelanggaran', violationData.noPolisi);
            const historyDocRef = doc(db, 'pembayaran_berhasil', violationData.noPolisi);

            const paidData = {
                ...violationData,
                status: 'Sudah Dibayar',
                tanggalPembayaran: new Date(),
                brivaCode: brivaNumber,
            };

            // 1. Pindahkan data ke koleksi pembayaran_berhasil
            await setDoc(historyDocRef, paidData);

            // 2. Hapus data dari koleksi pelanggaran (Opsional)
            await deleteDoc(originalDocRef);

            return violationData.noPolisi; // Mengembalikan ID untuk download PDF

        } catch (error) {
            console.error("Error memproses pembayaran/Firestore: ", error);
            throw new Error("Gagal menyimpan status pembayaran di server.");
        }
    };
    // ---------------------------------------------------------------------------------

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1 formData={formData} setFormData={setFormData} handleSubmit={handleStep1Submit} isLoading={isLoading} message={message} />;
            case 2:
                return <Step2 violationData={violationData} setCurrentStep={setCurrentStep} />;
            case 3:
                // Asumsi Step3 mengumpulkan data pengemudi/konfirmasi
                return <Step3 setCurrentStep={setCurrentStep} setConfirmationData={setConfirmationData} violationData={violationData} />;
            case 4:
                // Step 4 adalah Ringkasan dan konfirmasi akhir sebelum penerbitan BRIVA/pindah ke Step 5
                return <Step4 setCurrentStep={setCurrentStep} violationData={violationData} confirmationData={confirmationData} handleFinalSubmit={handleFinalSubmit} />;
            case 5:
                return (
                    <Step5
                        violationData={violationData}
                        handleSuccessfulPayment={handleSuccessfulPayment}
                        brivaNumber={brivaNumber} // Kirim kode BRIVA
                        tilangId={violationData?.noPolisi} // Kirim ID untuk download
                    />
                );
            default:
                return <Step1 />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-100 p-4 pt-20">
                <div className="container mx-auto max-w-5xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Konfirmasi Via Website.</h1>
                    <div className="bg-white p-8 rounded-lg shadow-md mt-6">
                        <Stepper currentStep={currentStep} />
                        {renderStep()}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}