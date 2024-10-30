import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ejemplo: ${usedPrefix + command} nombre del video`

    const randomReduction = Math.floor(Math.random() * 5) + 1;
    let search = await yts(text);
    let f = `\n\n${String.fromCharCode(68,101,118,101,108,111,112,101,100,32,98,121,32,73,39,109,32,70,122,32,126)}`;
    let isVideo = /vid$/.test(command);
    let urls = search.all[0].url;
    
    let infoTexto = `乂  Y O U T U B E   ${isVideo ? 'V I D E O' : 'A U D I O'}\n
✩ *Título ∙* ${search.all[0].title}\n
✩ *Duración ∙* ${search.all[0].timestamp}\n
✩ *Visitas ∙* ${search.all[0].views}\n
✩ *Autor ∙* ${search.all[0].author.name}\n
✩ *Publicado ∙* ${search.all[0].ago}\n
✩ *Url ∙* ${urls}\n`.trim();

    await conn.sendButton(m.chat, infoTexto + f, 'Marca del bot', search.all[0].thumbnail, [
        ['Audio 📀', `${usedPrefix}play ${urls}`],
        ['Video 🎥', `${usedPrefix}playvid ${urls}`]
    ], m)

    let res = await dl_vid(urls)
    let type = isVideo ? 'video' : 'audio';
    let video = res.data.mp4;
    let audio = res.data.mp3;

    conn.sendMessage(m.chat, { 
        [type]: { url: isVideo ? video : audio }, 
        gifPlayback: false, 
        mimetype: isVideo ? "video/mp4" : "audio/mpeg" 
    }, { quoted: m })
}

handler.command = ['play', 'playvid']
handler.help = ['play', 'playvid']
handler.tags = ['dl']
export default handler

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
} Utiliza este código de aquí cuando esté tiene un problema cuando preciono  el botón vuelve a reenviar la información del vídeo o música 
