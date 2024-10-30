import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo: ${usedPrefix + command} nombre del video`;

    let search = await yts(text);
    let videoData = search.all[0];
    let f = `\n\n${String.fromCharCode(68, 101, 118, 101, 108, 111, 112, 101, 100, 32, 98, 121, 32, 73, 39, 109, 32, 70, 122, 32, 126)}`;
    let urls = videoData.url;

    // Texto con la información del video o audio
    let infoTexto = `乂  Y O U T U B E   ${command === 'playvid' ? 'V I D E O' : 'A U D I O'}\n
✩ *Título ∙* ${videoData.title}\n
✩ *Duración ∙* ${videoData.timestamp}\n
✩ *Vistas ∙* ${videoData.views}\n
✩ *Publicado ∙* ${videoData.ago}\n
✩ *Url ∙* ${urls}\n`.trim();

    // Enviar el mensaje inicial con opciones de botones
    await conn.sendMessage(m.chat, { 
        image: { url: videoData.thumbnail }, 
        caption: infoTexto + f,
        buttons: [
            { buttonId: `${usedPrefix}playAudio ${urls}`, buttonText: { displayText: 'Audio 📀' }, type: 1 },
            { buttonId: `${usedPrefix}playVideo ${urls}`, buttonText: { displayText: 'Video 🎥' }, type: 1 }
        ],
        headerType: 4
    }, { quoted: m });

    await m.react('✅');
}

// Subcomandos para manejar el botón de Audio y Video
handler.command = ['play'];
handler.help = ['play'];
handler.tags = ['dl'];

export default handler;

handler.playAudio = async (conn, m, videoData, infoTexto) => {
    let res = await dl_vid(videoData.url);
    await conn.sendMessage(m.chat, {
        audio: { url: res.data.mp3 },
        mimetype: "audio/mpeg",
        fileName: `${videoData.title}.mp3`,
        caption: infoTexto,
    }, { quoted: m });
};

handler.playVideo = async (conn, m, videoData, infoTexto) => {
    let res = await dl_vid(videoData.url);
    await conn.sendMessage(m.chat, {
        video: { url: res.data.mp4 },
        mimetype: "video/mp4",
        fileName: `${videoData.title}.mp4`,
        caption: infoTexto,
    }, { quoted: m });
};

// Función para descargar el video
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

    return await response.json();
}
