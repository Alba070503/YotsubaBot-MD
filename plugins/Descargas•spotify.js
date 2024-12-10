import axios from 'axios';
import fetch from 'node-fetch';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import search from 'yt-search';

async function spotifyxv(query) {
    let token = await tokens();
    let response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=track',
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });
    const tracks = response.data.tracks.items;
    const results = tracks.map((track) => ({
        name: track.name,
        artista: track.artists.map((artist) => artist.name),
        album: track.album.name,
        duracion: timestamp(track.duration_ms),
        url: track.external_urls.spotify,
        imagen: track.album.images.length ? track.album.images[0].url : '',
    }));
    return results;
}

async function tokens() {
    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64'),
        },
        data: 'grant_type=client_credentials',
    });
    return response.data.access_token;
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

async function getBuffer(url, options) {
    try {
        options = options || {};
        const res = await axios({
            method: 'get',
            url,
            headers: {
                DNT: 1,
                'Upgrade-Insecure-Request': 1,
            },
            ...options,
            responseType: 'arraybuffer',
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

async function getTinyURL(text) {
    try {
        let response = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`);
        return response.data;
    } catch (error) {
        return text;
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Uso incorrecto del comando. Ejemplo: *${usedPrefix + command} Bellyache*`;
    try {
        m.react('⌛️');
        let songInfo = await spotifyxv(text);
        if (!songInfo.length) throw `*No se encontró una canción.*`;

        let res = songInfo[0];
        let shortURL = await getTinyURL(res.url);
        const info = `✨ *Título:*\n_${res.name}_\n\n` +
                     `🗣️ *Artista(s):*\n» _${res.artista.join(', ')}_\n\n` +
                     `🌐 *Spotify URL:*\n» _${shortURL}_\n\n` +
                     `🎶 *Disfruta de tu música.*`;

        let img = await getBuffer(res.imagen);
        let { videos } = await search(res.name);
        let v = videos[0].url;
        let yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
        let dl_url = await yt.audio['128kbps'].download();
        let ttl = await yt.title;

        conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${ttl}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
        await conn.sendMessage(m.chat, { text: info, contextInfo: { 
            forwardingScore: 9999999, 
            isForwarded: true, 
            "externalAdReply": {
                "showAdAttribution": true, 
                "renderLargerThumbnail": true, 
                "title": "Tu canción de Spotify", 
                "mediaType": 1, 
                "thumbnail": img, 
                "mediaUrl": shortURL, 
                "sourceUrl": shortURL 
            }
        }}, { quoted: m });
        m.react('✅️');
    } catch (error) {
        console.error(error);
    }
};

handler.command = /^(spotify|music)$/i;
export default handler;
