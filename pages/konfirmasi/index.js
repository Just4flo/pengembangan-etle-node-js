import { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import Step1 from '../../components/konfirmasi/Step1';
import Step2 from '../../components/konfirmasi/Step2';
import Step3 from '../../components/konfirmasi/Step3';
import Step4 from '../../components/konfirmasi/Step4';
import Step5 from '../../components/konfirmasi/Step5';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Komponen Stepper yang sudah diperbaiki
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
    const [confirmationData, setConfirmationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleStep1Submit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const pelanggaranRef = collection(db, 'pelanggaran');
            const q = query(pelanggaranRef,
                where("noReferensi", "==", formData.noReferensi.trim()),
                where("noPolisi", "==", formData.noPolisi.trim())
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const foundData = querySnapshot.docs[0].data();
                setViolationData(foundData);
                setCurrentStep(2);
            } else {
                setMessage('Data tidak ditemukan. Pastikan No. Referensi dan No. Polisi benar.');
            }
        } catch (error) {
            console.error("Error mencari data:", error);
            setMessage('Terjadi kesalahan koneksi. (Jika ini pertama kali, cek console browser untuk link pembuatan index Firebase)');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (!violationData) return;
        try {
            const docRef = doc(db, 'pelanggaran', violationData.noPolisi);
            await updateDoc(docRef, { status: 'Sudah Dikonfirmasi' });
            setCurrentStep(5);
        } catch (error) {
            console.error("Error updating status: ", error);
            alert("Gagal menyimpan konfirmasi. Silakan coba lagi.");
        }
    };

    const handleSuccessfulPayment = async () => {
        if (!violationData) return;
        try {
            const originalDocRef = doc(db, 'pelanggaran', violationData.noPolisi);
            const historyDocRef = doc(db, 'pembayaran_berhasil', violationData.noPolisi);

            const paidData = {
                ...violationData,
                status: 'Sudah Dibayar',
                tanggalPembayaran: new Date(),
                konfirmasiPengemudi: confirmationData,
            };

            await setDoc(historyDocRef, paidData);
            await deleteDoc(originalDocRef);

            console.log(`Dokumen untuk ${violationData.noPolisi} berhasil dipindahkan ke 'pembayaran_berhasil'.`);
        } catch (error) {
            console.error("Error memindahkan dokumen: ", error);
            alert("Gagal memproses pembayaran. Silakan coba lagi.");
            throw error;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1 formData={formData} setFormData={setFormData} handleSubmit={handleStep1Submit} isLoading={isLoading} message={message} />;
            case 2:
                return <Step2 violationData={violationData} setCurrentStep={setCurrentStep} />;
            case 3:
                return <Step3 setCurrentStep={setCurrentStep} setConfirmationData={setConfirmationData} />;
            case 4:
                return <Step4 setCurrentStep={setCurrentStep} violationData={violationData} confirmationData={confirmationData} handleFinalSubmit={handleFinalSubmit} />;
            case 5:
                return <Step5 violationData={violationData} handleSuccessfulPayment={handleSuccessfulPayment} />;
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