import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo: ${usedPrefix + command} nombre del video`;

    // Búsqueda en YouTube
    let search = await yts(text);
    let videoData = search.all[0];
    let f = `\n\n${String.fromCharCode(68,101,118,101,108,111,112,101,100,32,98,121,32,73,39,109,32,70,122,32,126)}`;
    let isVideo = /vid$/.test(command);
    let urls = videoData.url;

    // Información detallada del video o audio
    let infoTexto = `乂  Y O U T U B E   ${isVideo ? 'V I D E O' : 'A U D I O'}\n
✩ *Título ∙* ${videoData.title}\n
✩ *Duración ∙* ${videoData.timestamp}\n
✩ *Visitas ∙* ${videoData.views}\n
✩ *Autor ∙* ${videoData.author.name}\n
✩ *Publicado ∙* ${videoData.ago}\n
✩ *Url ∙* ${urls}\n`.trim();

    // Enviar mensaje con botones
    await conn.sendButton(m.chat, infoTexto + f, 'Marca del bot', videoData.thumbnail, [
        ['Audio 📀', `${usedPrefix}playaudio ${urls}`],
        ['Video 🎥', `${usedPrefix}playvideo ${urls}`]
    ], m);
};

// Función de manejo para audio y video
handler.handleMedia = async (m, { conn, text, command }) => {
    let url = text;
    let isVideo = command === 'playvideo';

    // Descargar el archivo
    let res = await dl_vid(url);
    let fileUrl = isVideo ? res.data.mp4 : res.data.mp3;

    // Información del mensaje
    let fileType = isVideo ? 'video' : 'audio';
    let mimeType = isVideo ? "video/mp4" : "audio/mpeg";

    // Enviar el archivo seleccionado
    await conn.sendMessage(m.chat, { 
        [fileType]: { url: fileUrl }, 
        mimetype: mimeType, 
        caption: `Aquí tienes el ${isVideo ? 'video' : 'audio'} solicitado!`
    }, { quoted: m });
};

// Configuración de comandos
handler.command = ['play', 'playvid'];
handler.help = ['play', 'playvid'];
handler.tags = ['dl'];
export default handler;

// Comandos adicionales para enviar audio y video al presionar el botón
handler.command = ['playaudio', 'playvideo'];
handler.help.push('playaudio', 'playvideo');
handler.tags.push('dl');

// Función para descargar el video/audio
async function dl_vid(url) {
    const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'api_key': 'free',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: url })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}
