// pages/api/bukti/[id].js

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase'; // Sesuaikan path

// Import Cloudinary SDK
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary menggunakan Environment Variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS
});

// Fungsi generateHtmlContent (Aman dari error - tidak berubah)
function generateHtmlContent(data) {
    const formattedDenda = (data.denda || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    const tglBayarObj = data.tglBayar instanceof Date ? data.tglBayar : new Date();
    const tglBayarFormatted = tglBayarObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    // HTML Content (tidak berubah)
    return `
    <html>
    <head>
        <title>Bukti Pembayaran ETLE</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 30px; margin: 0; background-color: #ffffff; width: 595px; } 
            .header { color: #c53030; text-align: center; border-bottom: 2px solid #c53030; padding-bottom: 10px; margin-bottom: 20px;}
            .detail-box { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 20px;}
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { border: 1px solid #eee; padding: 10px; }
            .label { background-color: #f9f9f9; font-weight: bold; width: 40%; }
            .value { font-weight: bold; color: #0056b3; }
            .footer { margin-top: 40px; text-align: center; color: #555; font-size: 12px;}
        </style>
    </head>
    <body>
        <div class="header"><h1>BUKTI PEMBAYARAN TILANG ELEKTRONIK</h1><p>KORLANTAS POLRI</p></div>
        <div class="detail-box"><p><strong>Status Pembayaran:</strong> <span style="color: green; font-weight: bold;">LUNAS</span></p><p><strong>Tanggal Pembayaran:</strong> ${tglBayarFormatted}</p></div>
        <table>
            <tr><td class="label">Nomor Referensi</td><td class="value">${data.noReferensi}</td></tr>
            <tr><td class="label">Kode Pembayaran BRIVA</td><td class="value">${data.brivaNumber}</td></tr>
            <tr><td class="label">No. Polisi Pelanggar</td><td class="value">${data.noPolisi}</td></tr>
            <tr><td class="label">Nama Konfirmasi</td><td class="value">${data.nama}</td></tr>
            <tr><td class="label">Jumlah Denda Dibayar</td><td style="color: #c53030; font-size: 1.2em;">${formattedDenda}</td></tr>
        </table>
        <div class="footer">Dokumen ini sah sebagai bukti pembayaran resmi denda ETLE dan tidak memerlukan tanda tangan basah.</div>
    </body>
    </html>
  `;
}

// Helper function to upload buffer to Cloudinary using stream
const uploadToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        stream.end(buffer);
    });
};

// --- HANDLER API (Upload ke Cloudinary + Kirim ke Browser) ---
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query; // No Polisi (ID Dokumen)
    let browser = null;

    try {
        // --- 1. Ambil Data Pembayaran DARI 'pembayaran_berhasil' ---
        const docRef = doc(db, 'pembayaran_berhasil', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Dokumen pembayaran untuk ${id} tidak ditemukan.`);
        }
        const dataFromDb = docSnap.data();

        // --- 2. Siapkan data untuk HTML ---
        const dataForHtml = {
            noReferensi: dataFromDb.noReferensi || 'N/A',
            noPolisi: dataFromDb.noPolisi || id,
            nama: dataFromDb.konfirmasiPengemudi?.pengemudi?.namaPengemudi || dataFromDb.pemilik || 'N/A',
            denda: dataFromDb.denda || 0,
            brivaNumber: dataFromDb.brivaCode || 'N/A',
            tglBayar: dataFromDb.tanggalPembayaran ? dataFromDb.tanggalPembayaran.toDate() : new Date(),
        };

        // --- 3. Buat konten HTML ---
        const htmlContent = generateHtmlContent(dataForHtml);

        // --- 4. Setup Puppeteer & Chromium ---
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 595, height: 842 });

        // --- 5. Render HTML dan Buat Screenshot (PNG Buffer) ---
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });

        // --- 6. UPLOAD KE CLOUDINARY ---
        console.log(`Mengunggah bukti untuk ${id} ke Cloudinary...`);
        const cloudinaryResult = await uploadToCloudinary(imageBuffer, {
            folder: 'bukti', // Folder tujuan di Cloudinary
            public_id: `bukti_pembayaran_${id}_${Date.now()}`, // Nama file unik
            resource_type: 'image'
        });

        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            throw new Error('Gagal mengunggah bukti ke Cloudinary.');
        }
        const cloudinaryUrl = cloudinaryResult.secure_url;
        console.log(`Upload Cloudinary sukses: ${cloudinaryUrl}`);

        // --- 7. UPDATE FIRESTORE dengan URL Cloudinary ---
        await updateDoc(docRef, {
            urlBuktiPembayaran: cloudinaryUrl // Simpan URL bukti pembayaran
        });
        console.log(`Firestore diupdate untuk ${id} dengan urlBuktiPembayaran.`);

        // --- 8. Kirim respons PNG ke Browser ---
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="Bukti_Pembayaran_ETLE_${id}.png"`);
        res.send(imageBuffer);

    } catch (error) {
        console.error('Error saat membuat/menyimpan gambar bukti:', error);
        res.status(500).json({
            message: 'Gagal memproses bukti pembayaran.',
            error: error.message
        });
    } finally {
        // --- 9. Tutup browser ---
        if (browser !== null) {
            await browser.close();
        }
    }
}