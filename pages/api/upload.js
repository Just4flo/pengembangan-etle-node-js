import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Konfigurasi Cloudinary dari file .env.local
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Matikan bodyParser bawaan Next.js agar formidable bisa bekerja
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        const file = files.file[0];

        // Unggah file ke Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
            // 📌 DI SINI KITA MENENTUKAN NAMA FOLDERNYA
            folder: 'etle',
        });

        // Kirim kembali URL yang aman dari Cloudinary
        res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ success: false, error: 'Upload failed' });
    }
}