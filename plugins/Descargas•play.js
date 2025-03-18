import axios from 'axios';
import crypto from 'crypto';
import fetch from 'node-fetch';

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],

  crypto: {
    hexToBuffer: hexString => Buffer.from(hexString.match(/.{1,2}/g).join(''), 'hex'),

    decrypt: async enc => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);

        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(content);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
  },

  isUrl: str => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  },

  youtube: url => {
    const regex = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of regex) {
      if (pattern.test(url)) return url.match(pattern)[1];
    }
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    return response.status ? { status: true, code: 200, data: response.data.cdn } : response;
  },

  download: async (link, format) => {
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "Ingresa un link válido de YouTube." };

    if (!format || !savetube.formats.includes(format)) {
      return { status: false, code: 400, error: "Formato inválido. Usa: 144, 240, 360, 480, 720, 1080, mp3", available_fmt: savetube.formats };
    }

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "No se pudo extraer el ID del video." };

    try {
      const cdnx = await savetube.getCDN();
      if (!cdnx.status) return cdnx;
      const cdn = cdnx.data;

      const result = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
      if (!result.status) return result;

      const decrypted = await savetube.crypto.decrypt(result.data.data);
      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id, downloadType: format === 'mp3' ? 'audio' : 'video', quality: format === 'mp3' ? '128' : format, key: decrypted.key
      });

      return {
        status: true, code: 200,
        result: {
          title: decrypted.title || "Desconocido",
          type: format === 'mp3' ? 'audio' : 'video',
          format, thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl, id, key: decrypted.key, duration: decrypted.duration,
          quality: format === 'mp3' ? '128' : format, downloaded: dl.data.data.downloaded || false
        }
      };
    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) return m.reply(`Uso: *${usedPrefix}play <url/título>*`);

  let url = args[0];
  let isLink = savetube.isUrl(url);
  let videoId = isLink ? savetube.youtube(url) : null;

  try {
    if (!isLink) {
      let res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(url)}`);
      let text = await res.text();
      videoId = text.match(/"videoId":"(.*?)"/)?.[1];
      if (!videoId) return m.reply("No se encontraron resultados.");
      url = `https://youtu.be/${videoId}`;
    }

    let res = await savetube.download(url, 'mp3');
    if (!res.status) return m.reply(`Error: ${res.error}`);

    let { title, download, thumbnail } = res.result;

    const infoTexto = `乂  Y O U T U B E   M U S I C\n
✩ *Título ∙* ${title}\n
✩ *Url ∙* ${url}\n`.trim();

    await conn.sendButton(m.chat, infoTexto, 'Selecciona una opción:', thumbnail, [
      ['Audio 📀', `${usedPrefix}yta ${url}`],
      ['Video 🎥', `${usedPrefix}ytv ${url}`]
    ], m);
  } catch (error) {
    console.error(error);
    return m.reply("Error inesperado.");
  }
};

handler.help = ['play'];
handler.command = ['play'];
handler.tags = ['downloader'];

export default handler;
