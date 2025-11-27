// utils/pdfGenerator.js
import { jsPDF } from 'jspdf';

// Format tanggal untuk PDF
const formatTanggalPDF = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return 'Invalid Date';
    }
    try {
        return timestamp.toDate().toLocaleString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
        });
    } catch (e) {
        return 'Error Formatting Date';
    }
};

// Format Rupiah untuk PDF
const formatRupiahPDF = (number) => {
    return (number || 0).toLocaleString('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    });
};

// Fungsi untuk load image dan convert ke base64
const loadImageAsBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
};

// Fungsi untuk generate surat tilang PDF dengan gambar
export const generateSuratTilang = async (pelanggaran) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // SET SEMUA TEKS MENJADI HITAM
    doc.setTextColor(0, 0, 0); // Hitam

    // Header dengan background merah, tapi TEKS TETAP HITAM
    doc.setFillColor(220, 53, 69); // Merah untuk background
    doc.rect(0, 0, pageWidth, 25, 'F');

    // TEKS HEADER TETAP HITAM
    doc.setTextColor(0, 0, 0); // Pastikan teks hitam
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT TILANG RESMI', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text('KEPOLISIAN NEGARA REPUBLIK INDONESIA', pageWidth / 2, 22, { align: 'center' });

    let yPosition = 40;

    // Informasi Nomor Surat - TEKS HITAM
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nomor: ST/${pelanggaran.noReferensi || pelanggaran.id.substring(0, 8).toUpperCase()}/${new Date().getFullYear()}`, 20, yPosition);
    yPosition += 10;

    // Garis pemisah - HITAM
    doc.setDrawColor(0, 0, 0); // Garis hitam
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Data Pelanggaran - SEMUA DATA DITAMPILKAN DENGAN TEKS HITAM
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PELANGGARAN LENGKAP', 20, yPosition);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    // Data utama - SEMUA TEKS HITAM
    const dataRows = [
        ['Tanggal & Waktu', ': ' + formatTanggalPDF(pelanggaran.tanggalPelanggaran)],
        ['No. Polisi', ': ' + (pelanggaran.noPolisi || 'Tidak tersedia')],
        ['Nama Pemilik', ': ' + (pelanggaran.pemilik || 'Tidak tersedia')],
        ['Jenis Pelanggaran', ': ' + (pelanggaran.jenisPelanggaran || 'Tidak tersedia')],
        ['Lokasi', ': ' + (pelanggaran.lokasi || 'Tidak tersedia')],
        ['Denda', ': ' + formatRupiahPDF(pelanggaran.denda)],
        ['No. Referensi', ': ' + (pelanggaran.noReferensi || 'Tidak tersedia')],
        ['Status', ': ' + (pelanggaran.status || 'Tidak tersedia')]
    ];

    dataRows.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value, 50, yPosition);
        yPosition += 6;
    });

    yPosition += 5;

    // Data kendaraan tambahan - TEKS HITAM
    const dataKendaraan = [
        ['No. Mesin', ': ' + (pelanggaran.noMesin || 'Tidak tersedia')],
        ['No. Rangka', ': ' + (pelanggaran.noRangka || 'Tidak tersedia')]
    ];

    doc.setFont('helvetica', 'bold');
    doc.text('DATA KENDARAAN:', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    dataKendaraan.forEach(([label, value]) => {
        doc.text(label, 20, yPosition);
        doc.text(value, 50, yPosition);
        yPosition += 6;
    });

    yPosition += 10;

    // Tambahkan gambar bukti jika ada
    if (pelanggaran.urlFotoBukti) {
        try {
            doc.setFont('helvetica', 'bold');
            doc.text('BUKTI FOTO PELANGGARAN:', 20, yPosition);
            yPosition += 8;

            const imageData = await loadImageAsBase64(pelanggaran.urlFotoBukti);
            if (imageData) {
                // Hitung ukuran gambar yang sesuai
                const imgWidth = 80;
                const imgHeight = 60;

                // Cek jika gambar terlalu besar untuk halaman
                if (yPosition + imgHeight > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Add image dengan ukuran yang sesuai
                doc.addImage(imageData, 'JPEG', 20, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;

                // Tambahkan keterangan di bawah gambar - TEKS HITAM
                doc.setFontSize(8);
                doc.text('Gambar 1: Bukti Foto Pelanggaran', 20, yPosition);
                doc.setFontSize(9);
                yPosition += 5;
            }
        } catch (error) {
            console.error('Error adding image to PDF:', error);
            doc.text('Gagal memuat gambar bukti', 20, yPosition);
            yPosition += 10;
        }
    } else {
        doc.setFont('helvetica', 'bold');
        doc.text('BUKTI FOTO PELANGGARAN:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text('Tidak ada bukti foto', 20, yPosition);
        yPosition += 10;
    }

    // Keterangan tambahan - TEKS HITAM
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('KETERANGAN DAN TINDAK LANJUT:', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    const keterangan = [
        '1. Surat tilang ini harus diselesaikan dalam waktu 14 (empat belas) hari kerja',
        '2. Pembayaran denda dapat dilakukan di bank yang ditunjuk atau loket pembayaran resmi',
        '3. Jika tidak diselesaikan dalam waktu yang ditentukan, akan dikenakan sanksi tambahan',
        '4. Surat tilang ini sah dan dapat digunakan sebagai bukti hukum yang berlaku',
        '5. Untuk informasi lebih lanjut, hubungi kantor polisi terdekat'
    ];

    keterangan.forEach(text => {
        // Cek jika perlu halaman baru
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(text, 25, yPosition);
        yPosition += 5;
    });

    // Tanda tangan - TEKS HITAM
    yPosition += 10;
    // Cek jika perlu halaman baru untuk tanda tangan
    if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
    }

    const signatureX = pageWidth - 80;
    doc.text('Hormat kami,', signatureX, yPosition);
    yPosition += 15;
    doc.text('Ladusing', signatureX, yPosition);
    yPosition += 15;
    doc.text('_________________________', signatureX, yPosition);
    yPosition += 10;
    doc.setFontSize(8);
    doc.text(`NIP: ${generateRandomNIP()}`, signatureX, yPosition);

    // Footer - TEKS HITAM
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100); // Gray untuk footer
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc;
};

// Fungsi untuk generate NIP random (untuk demo)
const generateRandomNIP = () => {
    return '19' + Math.floor(10000000 + Math.random() * 90000000);
};