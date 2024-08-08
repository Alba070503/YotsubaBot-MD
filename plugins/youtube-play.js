import fg from 'api-dylux';
import yts from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    if (!text) return conn.reply(m.chat, `*🚩 Ingresa el título o enlace de un video de YouTube.*`, m);

    let url = args[0];
    let vid = null;

    try {
        await m.react('🕓'); // Reacción inicial para indicar que el bot está procesando

        // Comprobación y búsqueda de video
        if (url.startsWith('https://youtu.be/') || url.startsWith('https://www.youtube.com/')) {
            const videoId = url.split('v=')[1] || url.split('youtu.be/')[1];
            vid = (await yts({ videoId })).videos[0];
        } else {
            let res = await yts(text);
            vid = res.videos[0];
        }

        // Si no se encuentra el video
        if (!vid) return conn.reply(m.chat, `*☓ No se encontraron resultados para tu búsqueda.*`, m);

        // Información del video
        const infoTexto = `乂  Y O U T U B E   M U S I C\n
        ✩ *Título ∙* ${vid.title}\n
        ✩ *Duración ∙* ${vid.timestamp}\n
        ✩ *Visitas ∙* ${vid.views}\n
        ✩ *Autor ∙* ${vid.author.name}\n
        ✩ *Publicado ∙* ${vid.ago}\n
        ✩ *Url ∙* ${'https://youtu.be/' + vid.videoId}\n`.trim();

        // Botones con opciones de descarga
        await conn.sendButton(m.chat, infoTexto, wm, vid.thumbnail, [
            ['Audio 📀', `${usedPrefix}mp3 ${url || text}`],
            ['Video 🎥', `${usedPrefix}mp4 ${url || text}`],
            ['AudioDoc 📀', `${usedPrefix}mp3doc ${url || text}`],
            ['VideoDoc 🎥', `${usedPrefix}mp4doc ${url || text}`]
        ], null, [['Canal', `https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04`]], m);

    } catch (error) {
        console.error("Error en el proceso:", error);

        // Mensaje de error detallado
        await conn.reply(m.chat, `*☓ Ocurrió un error inesperado:*\n${error.message || error}`, m).then(_ => m.react('✖️'));
    }
}

handler.help = ["play"].map(v => v + " <formato> <búsqueda>");
handler.tags = ["downloader"];
handler.command = ['play', 'play2', 'mp3', 'mp4', 'mp3doc', 'mp4doc'];
handler.register = true;
handler.star = 1;

export default handler;
