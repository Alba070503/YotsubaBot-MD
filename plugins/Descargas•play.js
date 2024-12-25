/**
© ZENITH
ᘎ https://whatsapp.com/channel/0029Vai9MMj5vKABWrYzIJ2Z
*/

import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, args }) => {
  try {
    const query = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || "";
    if (!query.trim()) return m.reply("Por favor, ingresa una palabra clave para buscar.");

    await m.reply("Buscando, por favor espera...");

    const res = await yts(query);
    const vid = res.videos[0];
    if (!vid) return m.reply("No se encontró ningún video. Prueba con otra palabra clave.");

    const { title, thumbnail, timestamp, views, ago, url } = vid;
    const formattedViews = parseInt(views).toLocaleString("id-ID") + " vistas";
    const captvid = `*Título:* ${title}\n*Duración:* ${timestamp}\n*Vistas:* ${formattedViews}\n*Subido hace:* ${ago}\n*Enlace:* ${url}`;

    // Descargar la miniatura del video
    const ytthumb = (await conn.getFile(thumbnail))?.data;

    const infoReply = {
      contextInfo: {
        externalAdReply: {
          body: "Descargando el resultado, por favor espera...",
          mediaType: 1,
          mediaUrl: url,
          previewType: 0,
          renderLargerThumbnail: true,
          sourceUrl: url,
          thumbnail: ytthumb,
          title: "Y O U T U B E - P L A Y",
        },
      },
    };

    await conn.reply(m.chat, captvid, m, infoReply);

    // Realizar la solicitud al API de descarga
    const apiRes = await fetch(`https://api-rin-tohsaka.vercel.app/download/ytmp3?url=${url}`);
    const json = await apiRes.json();

    if (json.status) {
      const { result } = json;
      const { download } = result;

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: download.url },
          caption: `*Título:* ${title}\n*Tamaño del archivo:* ${download.size}\n*Calidad:* ${download.quality}`,
          mimetype: "audio/mpeg",
          contextInfo: infoReply.contextInfo,
        },
        { quoted: m }
      );
    } else {
      await m.reply("No se pudo descargar el audio. Intenta nuevamente.");
    }
  } catch (e) {
    console.error(e);
    await m.reply("Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
  }
};

handler.help = ["play <término de búsqueda>"];
handler.tags = ["downloader"];
handler.command = /^(play|ytplay)$/i;
handler.limit = true;

export default handler;
