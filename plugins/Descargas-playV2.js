import fetch from 'node-fetch';
import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'play') {
        if (!text) return conn.reply(m.chat, `「 ✰ 」INGRESA UN *ENLACE* O *TITULO* DEL *AUDIO* QUE DESEA DESCARGAR DE *YOUTUBE*\n\n*• EJEMPLO:*\n> ${usedPrefix + command} Ryllz - Nemesis`, m);

        try {
            const search = await yts(text);
            if (m.text.includes('http://') || m.text.includes('https://') || m.text.includes('youtube.com') || m.text.includes('youtu.be')) {
                return conn.reply(m.chat, `「 ✰ 」DESCARGA NO VALIDA.\n\n> SI DESEA REALIZAR UNA *DESCARGA* DE LA PLATAFORMA DE *YOUTUBE* UTILIZANDO UN *ENLACE* DE DESCARGA, DEBE UTILIZAR LOS SIGUIENTES COMANDOS A CONTINUACION DEPENDIENDO DE LO QUE QUIERA DESCARGAR\n\n❀ */YTMP3* = AUDIO\n❀ */YTMP4* = VIDEO`, m);
            }

            let bodyv1 = `「 ✰ 」 *RESULTADOS ENCONTRADOS:❀ *TITULO:* > ${search.videos[0].title}\n\`\`\`----------\`\`\`\n❀ *VISTAS:*\n> ${search.videos[0].views}\n\`\`\`----------\`\`\`\n❀ *DURACION:*\n> ${search.videos[0].duration}\n\`\`\`----------\`\`\`\n❀ *SUBIDO:*\n> ${search.videos[0].ago}\n\`\`\`----------\`\`\`\n❀ *URL:*\n> ${search.videos[0].url}\n\`\`\`----------\`\`\`\n\`ENVIANDO SUS RESULTADOS...\``;
 conn.sendMessage(m.chat, { image: { url: search.videos[0].thumbnail }, caption: bodyv1 }, { quoted: m });

const api = await axios.get(`https://mahiru-shiina.vercel.app/download/ytmp3?url=${search.videos[0].url}`)
const response = await api.data.data.download;
            
      await conn.sendMessage(m.chat, { audio: { url: response }, mimetype: 'audio/mpeg', fileName: `${search.videos[0].title}.mp3` }, { quoted: m });
        } catch (e) {
            conn.reply(m.chat, `「 ✰ 」OCURRIO UN FALLO AL PROCESAR SU SOLICITUD\n\n> ${e}`, m);
        }
    }

    if (command === 'play2') {
        if (!text) return conn.reply(m.chat, `「 ✰ 」INGRESA UN *TITULO* DEL *VIDEO* QUE DESEA DESCARGAR DE *YOUTUBE*\n\n*• EJEMPLO:*\n> ${usedPrefix + command} Ryllz - Nemesis`, m);

        try {
            const search = await yts(text);
            if (m.text.includes('http://') || m.text.includes('https://') || m.text.includes('youtube.com') || m.text.includes('youtu.be')) {
                return conn.reply(m.chat, `「 ✰ 」DESCARGA NO VALIDA.\n\n> SI DESEA REALIZAR UNA *DESCARGA* DE LA PLATAFORMA DE *YOUTUBE* UTILIZANDO UN *ENLACE* DE DESCARGA, DEBE UTILIZAR LOS SIGUIENTES COMANDOS A CONTINUACION DEPENDIENDO DE LO QUE QUIERA DESCARGAR\n\n❀ */YTMP3* = AUDIO\n❀ */YTMP4* = VIDEO`, m);
            }

            let bodyv2 = `「 ✰ 」 *RESULTADOS ENCONTRADOS:*\n> BUSQUEDA: ${text}\n\n❀ *TITULO:* > ${search.videos[0].title}\n\`\`\`----------\`\`\`\n❀ *VISTAS:*\n> ${search.videos[0].views}\n\`\`\`----------\`\`\`\n❀ *DURACION:*\n> ${search.videos[0].duration}\n\`\`\`----------\`\`\`\n❀ *SUBIDO:*\n> ${search.videos[0].ago}\n\`\`\`----------\`\`\`\n❀ *URL:*\n> ${search.videos[0].url}\n\`\`\`----------\`\`\`\n\`ENVIANDO SUS RESULTADOS...\``;
            conn.sendMessage(m.chat, { image: { url: search.videos[0].thumbnail }, caption: bodyv2 }, { quoted: m });

const api = await axios.get(`https://mahiru-shiina.vercel.app/download/ytmp4?url=${search.videos[0].url}`)
const response = await api.data.data.download;
            
            await conn.sendMessage(m.chat, { video: { url: response }, mimetype: 'video/mp4', fileName: `${search.videos[0].title}.mp4` }, { quoted: m });
        } catch (e) {
            conn.reply(m.chat, `「 ✰ 」OCURRIO UN FALLO AL PROCESAR SU SOLICITUD\n\n> ${e}`, m);
        }
    }
};

handler.command = ['play', 'play2'];

export default handler;

/*
• Código Original: Rin Tohsaka - Bot (Case)
• Adaptación: @Alba070503
• Mejora y Funcionalidad: GabrielVz
*/
