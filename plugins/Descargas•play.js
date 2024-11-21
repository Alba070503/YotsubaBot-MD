import yts from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo: ${usedPrefix + command} diles`;

    try {
        const search = await yts(text);
        const isVideo = /vid$/.test(command);
        const urls = search.all[0].url;

        const body = `\`YouTube Play\`

*Titulo:* ${search.all[0].title}
*Vistas:* ${search.all[0].views}
*Duracion:* ${search.all[0].timestamp}
*Subido:* ${search.all[0].ago}
*Url:* ${urls}

*Su ${isVideo ? 'Video' : 'Audio'} se está enviando, espere un momento...*`;

        // Enviar mensaje de información
        await conn.sendMessage(m.chat, { 
            image: { url: search.all[0].thumbnail }, 
            caption: body 
        }, { quoted: m });

        // Descargar el video o audio
        const res = await dl_vid(urls);
        const videoUrl = res.data.mp4;
        const audioUrl = res.data.mp3;

        const type = isVideo ? 'video' : 'audio';
        const mediaUrl = isVideo ? videoUrl : audioUrl;

        // Enviar archivo multimedia correctamente
        await conn.sendMessage(m.chat, { 
            [type]: { url: mediaUrl }, 
            gifPlayback: false, 
            mimetype: isVideo ? "video/mp4" : "audio/mpeg" 
        }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        m.reply('Hubo un problema al procesar tu solicitud. Intenta nuevamente.');
    }
};

handler.command = ['play', 'playvid'];
handler.help = ['play', 'playvid'];
handler.tags = ['dl'];
export default handler;

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
        throw new Error(`Error HTTP! Estado: ${response.status}`);
    }

    const data = await response.json();
    
    // Validar que el video tenga un formato reproducible
    if (!data || !data.data || (!data.data.mp4 && !data.data.mp3)) {
        throw new Error('El formato del archivo no es válido o está dañado.');
    }

    return data;
}
