import fg from 'api-dylux';
import yts from 'yt-search';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    if (!text) return conn.reply(m.chat, `*🚩 Ingresa el título o enlace de un video de YouTube.*`, m);

    let url = args[0];
    let vid = null;

    try {
        await m.react('🕓'); // Reacción inicial para indicar que el bot está procesando

        if (url.startsWith('https://youtu.be/') || url.startsWith('https://www.youtube.com/')) {
            // Obtener información del video directamente desde YouTube
            const videoInfo = await ytdl.getInfo(url);
            vid = {
                title: videoInfo.videoDetails.title,
                url: videoInfo.videoDetails.video_url,
                timestamp: new Date(videoInfo.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
                views: videoInfo.videoDetails.viewCount,
                author: videoInfo.videoDetails.author.name,
                ago: videoInfo.videoDetails.uploadDate,
                thumbnail: videoInfo.videoDetails.thumbnails[0].url,
            };
        } else {
            // Búsqueda de video usando palabras clave
            let res = await yts(text);
            if (res.videos.length > 0) {
                vid = res.videos[0];
            } else {
                throw new Error("No se encontraron videos para la búsqueda dada.");
            }
        }

        const infoTexto = `乂  Y O U T U B E   M U S I C\n
        ✩ *Título ∙* ${vid.title || 'Desconocido'}\n
        ✩ *Duración ∙* ${vid.timestamp || 'Desconocida'}\n
        ✩ *Visitas ∙* ${vid.views || 'Desconocidas'}\n
        ✩ *Autor ∙* ${vid.author || 'Desconocido'}\n
        ✩ *Publicado ∙* ${vid.ago || 'Desconocido'}\n
        ✩ *Url ∙* ${vid.url || 'Desconocido'}\n`.trim();

        // Botones con opciones de descarga
        await conn.sendButton(m.chat, infoTexto, wm, vid.thumbnail || '', [
            ['Audio 📀', `${usedPrefix}mp3 ${url || text}`],
            ['Video 🎥', `${usedPrefix}mp4 ${url || text}`],
            ['AudioDoc 📀', `${usedPrefix}mp3doc ${url || text}`],
            ['VideoDoc 🎥', `${usedPrefix}mp4doc ${url || text}`]
        ], null, [['Canal', `https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04`]], m);

        // Procesamiento de comandos de descarga
        if (command == 'mp3' || command == 'mp3doc') {
            let audioUrl;
            try {
                let yt = await youtubedl(vid.url).catch(async _ => await youtubedlv2(vid.url));
                audioUrl = yt.audio['128kbps'].download;
            } catch (error) {
                let dataRE = await fetch(`https://api.akuari.my.id/downloader/youtube?link=${vid.url}`);
                let dataRET = await dataRE.json();
                audioUrl = dataRET.mp3[1].url;
            }

            if (command == 'mp3') {
                await conn.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
            } else if (command == 'mp3doc') {
                await conn.sendMessage(m.chat, { document: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${vid.title}.mp3` }, { quoted: m });
            }
        } else if (command == 'mp4' || command == 'mp4doc') {
            let videoUrl;
            try {
                let yt = await youtubedl(vid.url).catch(async _ => await youtubedlv2(vid.url));
                videoUrl = yt.video['360p'].download;
            } catch (error) {
                let mediaa = await ytMp4(vid.url);
                videoUrl = mediaa.result;
            }

            if (command == 'mp4') {
                await conn.sendMessage(m.chat, { video: { url: videoUrl }, fileName: `${vid.title}.mp4`, mimetype: 'video/mp4' }, { quoted: m });
            } else if (command == 'mp4doc') {
                await conn.sendMessage(m.chat, { document: { url: videoUrl }, mimetype: 'video/mp4', fileName: `${vid.title}.mp4` }, { quoted: m });
            }
        }
    } catch (error) {
        console.error("Error en el proceso:", error);
        await conn.reply(m.chat, `*☓ Ocurrió un error inesperado:*\n${error.message || error}`, m).then(_ => m.react('✖️'));
    }
};

handler.help = ["play"].map(v => v + " <formato> <búsqueda>");
handler.tags = ["downloader"];
handler.command = ['play', 'play2', 'mp3', 'mp4', 'mp3doc', 'mp4doc'];
handler.register = true;
handler.star = 1;

export default handler;

async function ytMp4(url) {
    return new Promise(async (resolve, reject) => {
        ytdl.getInfo(url).then(async (getUrl) => {
            let result = [];
            for (let i = 0; i < getUrl.formats.length; i++) {
                let item = getUrl.formats[i];
                if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
                    let { qualityLabel, contentLength } = item;
                    let bytes = await bytesToSize(contentLength);
                    result.push({ video: item.url, quality: qualityLabel, size: bytes });
                }
            }
            let resultFix = result.filter(x => x.video && x.size && x.quality);
            let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
            let tinyUrl = tiny.data;
            let title = getUrl.videoDetails.title;
            let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
            resolve({ title, result: tinyUrl, thumb });
        }).catch(reject);
    });
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}
