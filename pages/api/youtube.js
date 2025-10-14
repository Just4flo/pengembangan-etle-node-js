export default async function handler(req, res) {
    const { videoId } = req.query; // Kita akan menerima videoId dari frontend

    if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
    }

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Ambil kunci API dari .env.local

    if (!YOUTUBE_API_KEY) {
        console.error('YOUTUBE_API_KEY is not set in .env.local');
        return res.status(500).json({ error: 'Server configuration error: YouTube API Key missing.' });
    }

    try {
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(youtubeApiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const snippet = data.items[0].snippet;
            return res.status(200).json({
                title: snippet.title,
                channelTitle: snippet.channelTitle,
                thumbnailUrl: snippet.thumbnails.high.url // Mengambil thumbnail kualitas tinggi
            });
        } else {
            return res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error('Error fetching YouTube video data:', error);
        return res.status(500).json({ error: 'Failed to fetch video data from YouTube API.' });
    }
}