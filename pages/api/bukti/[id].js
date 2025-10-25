// pages/api/bukti/[id].js

import puppeteer from 'puppeteer';
import { doc, getDoc } from 'firebase/firestore';
// PASTIKAN PATH INI BENAR menunjuk ke file firebase.js Anda
import { db } from '../../../config/firebase';

// Fungsi untuk generate HTML (AMAN DARI ERROR)
function generateHtmlContent(data) {
    // Memberi nilai default 0 jika 'denda' undefined
    const formattedDenda = (data.denda || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    // Pastikan data.tglBayar adalah objek Date
    const tglBayarObj = data.tglBayar instanceof Date ? data.tglBayar : new Date();
    const tglBayarFormatted = tglBayarObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    // HTML (Konten tetap sama)
    return `
    <html>
    <head>
        <title>Bukti Pembayaran ETLE</title>
        <style>
            /* ... (CSS Anda tetap sama) ... */
            body { font-family: Arial, sans-serif; padding: 30px; margin: 0; background-color: #ffffff; width: 595px; /* A4 width approx */ } 
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
        <div class="header">
            <h1>BUKTI PEMBAYARAN TILANG ELEKTRONIK</h1>
            <p>KORLANTAS POLRI</p>
        </div>
        <div class="detail-box">
            <p><strong>Status Pembayaran:</strong> <span style="color: green; font-weight: bold;">LUNAS</span></p>
            <p><strong>Tanggal Pembayaran:</strong> ${tglBayarFormatted}</p>
        </div>
        <table>
            <tr><td class="label">Nomor Referensi</td><td class="value">${data.noReferensi}</td></tr>
            <tr><td class="label">Kode Pembayaran BRIVA</td><td class="value">${data.brivaNumber}</td></tr>
            <tr><td class="label">No. Polisi Pelanggar</td><td class="value">${data.noPolisi}</td></tr>
            <tr><td class="label">Nama Konfirmasi</td><td class="value">${data.nama}</td></tr>
            <tr><td class="label">Jumlah Denda Dibayar</td><td style="color: #c53030; font-size: 1.2em;">${formattedDenda}</td></tr>
        </table>
        <div class="footer">
            Dokumen ini sah sebagai bukti pembayaran resmi denda ETLE dan tidak memerlukan tanda tangan basah.
        </div>
    </body>
    </html>
  `;
}


// --- HANDLER API (Output PNG) ---
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query;
    let browser = null;

    try {
        // --- 1. Ambil Data Pembayaran DARI 'pembayaran_berhasil' ---
        const docRef = doc(db, 'pembayaran_berhasil', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Dokumen pembayaran untuk ${id} tidak ditemukan.`);
        }

        const dataFromDb = docSnap.data();

        // --- 2. Menyiapkan data untuk HTML ---
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

        // --- 4. Setup Puppeteer ---
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        // Atur viewport agar sesuai dengan ukuran A4 (opsional, sesuaikan CSS jika perlu)
        await page.setViewport({ width: 595, height: 842 });

        // --- 5. Render HTML dan Buat Screenshot (PNG) ---
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const imageBuffer = await page.screenshot({
            type: 'png',       // Tipe file gambar
            fullPage: true     // Ambil seluruh halaman HTML
        });

        // --- 6. Kirim respons sebagai file PNG ---
        res.setHeader('Content-Type', 'image/png'); // Ubah Content-Type
        res.setHeader('Content-Disposition', `attachment; filename="Bukti_Pembayaran_ETLE_${id}.png"`); // Ubah ekstensi file
        res.send(imageBuffer); // Kirim buffer gambar

    } catch (error) {
        console.error('Error saat membuat gambar bukti:', error);
        res.status(500).json({
            message: 'Gagal membuat gambar bukti pembayaran.',
            error: error.message
        });
    } finally {
        // --- 7. Tutup browser ---
        if (browser !== null) {
            await browser.close();
        }
    }
}