import yts from 'yt-search';
import axios from 'axios';
import fetch from 'node-fetch';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const videoApis = [
  (url) => `https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${url}`,
  (url) => `https://api.akuari.my.id/downloader/youtube?link=${url}`,
  (url) => `https://api.xyroinee.xyz/api/downloader/ytmp4?url=${url}&apikey=exemple`
];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('Formato no válido.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, image: info.image, title, downloadUrl };
      }
      throw new Error('Error al obtener detalles del video.');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    try {
      let attempts = 0;
      while (attempts < 20) { 
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      throw new Error('Tiempo de espera agotado.');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

const getVideoUrl = async (url) => {
  for (let api of videoApis) {
    try {
      let apiUrl = api(url);
      let response = await fetch(apiUrl);
      let data = await response.json();

      if (data.result?.download_url) {
        return data.result.download_url;
      } else if (data.url) {
        return data.url;
      }
    } catch (error) {
      console.error(`API fallida: ${api(url)}`);
    }
  }
  throw new Error("No se pudo obtener el video.");
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
    message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }
  };

  if (!text) throw `\`\`\`[ 🌴 ] Ingresa un texto. Ejemplo:\n${usedPrefix + command} Never Gonna Give You Up\`\`\``;

  const search = await yts(text);
  if (!search.all || search.all.length === 0) throw "No se encontraron resultados.";

  const videoInfo = search.all[0];
  const thumbnail = videoInfo.thumbnail || 'https://default-image-url.com/default.jpg';

  const body = `🎵 *Título:* ${videoInfo.title}
📊 *Vistas:* ${videoInfo.views}
⏳ *Duración:* ${videoInfo.timestamp}
📅 *Subido:* ${videoInfo.ago}
🔗 *URL:* ${videoInfo.url}

⏳ *Enviando, espera un momento...*`;

  try {
    if (command === 'play' || command === 'play2' || command === 'playvid') {
      await conn.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: body,
        footer: `alxile no pidas mamadas`,
        buttons: [
          { buttonId: `.ytmp3 ${videoInfo.url}`, buttonText: { displayText: 'Audio' } },
          { buttonId: `.ytmp4 ${videoInfo.url}`, buttonText: { displayText: 'Video' } }
        ],
        viewOnce: true,
        headerType: 4
      }, { quoted: fkontak });
      m.react('🍆');
    } else if (command === 'yta' || command === 'ytmp3') {
      m.react('🍆');
      let audio = await ddownr.download(videoInfo.url, 'mp3');
      conn.sendMessage(m.chat, {
        audio: { url: audio.downloadUrl },
        mimetype: "audio/mpeg"
      }, { quoted: fkontak });
    } else if (command === 'ytv' || command === 'ytmp4') {
      m.react('🍆');
      let videoUrl = await getVideoUrl(videoInfo.url);
      conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: `🎬 *Título:* ${videoInfo.title}\n🔗 *URL:* ${videoInfo.url}`
      }, { quoted: fkontak });
    } else {
      throw "Comando no reconocido.";
    }
  } catch (error) {
    throw "Ocurrió un error al procesar tu solicitud.";
  }
};

handler.command = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'play2', 'ytmp3'];
handler.tags = ['descargas'];
handler.diamond = 4;

export default handler;
