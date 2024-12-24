import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Necesitas proporcionar una consulta de búsqueda.\n\nEjemplo: *${usedPrefix}${command} Despacito*`,
    }, { quoted: m });
  }

  try {
    // Notificar que se está buscando el video
    let statusMessage = await conn.sendMessage(m.chat, { text: '🔎 Buscando video...' }, { quoted: m });

    // Buscar el video en YouTube
    let search = await yts(text);
    if (!search.videos.length) {
      return conn.sendMessage(m.chat, {
        text: '⚠️ No se encontraron resultados. Intenta con una búsqueda más específica.',
      }, { quoted: m });
    }
    let video = search.videos[0];

    // Mostrar información del video
    let infoText = `🎥 *Título:* ${video.title}\n⏳ *Duración:* ${video.timestamp}\n👁️ *Vistas:* ${video.views}\n📅 *Publicado:* ${video.ago}\n🌐 *Enlace:* ${video.url}\n\n⬇️ *Preparando descarga...*`;
    await conn.sendMessage(m.chat, { text: infoText }, { quoted: m });

    // Descargar el video usando la API
    const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4v2?url=${video.url}`;
    const response = await axios.get(apiUrl);

    if (!response.data.result || !response.data.result.url) {
      return conn.sendMessage(m.chat, {
        text: '⚠️ No se pudo descargar el video. Por favor, inténtalo de nuevo.',
      }, { quoted: m });
    }

    // Enviar el video descargado
    const { url: videoUrl, quality, size } = response.data.result;
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: `🎥 *Título:* ${video.title}\n📽 *Calidad:* ${quality}\n📦 *Tamaño:* ${size}`,
      mimetype: 'video/mp4',
    }, { quoted: m });

  } catch (error) {
    console.error('Error:', error);
    await conn.sendMessage(m.chat, {
      text: '⚠️ Ocurrió un error inesperado. Intenta de nuevo más tarde.',
    }, { quoted: m });
  }
};

handler.help = ['play2 *<consulta>*', 'playvideo *<consulta>*'];
handler.tags = ['downloader'];
handler.command = /^(play2|playvideo)$/i;

export default handler;
