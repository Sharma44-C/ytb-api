const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('YouTube Download API is running');
});

app.get('/download', async (req, res) => {
  const { url, format } = req.query;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').substring(0, 40);

  res.header('Content-Disposition', `attachment; filename="${title}.${format}"`);

  try {
    if (format === 'mp3') {
      ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
    } else {
      ytdl(url, { filter: 'videoandaudio', quality: 'highest' }).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
