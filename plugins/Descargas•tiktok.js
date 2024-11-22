import axios from 'axios';
import cheerio from 'cheerio';

const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");
};

async function shortener(url) {
  return url; // Puedes agregar lógica para acortar URLs si lo necesitas
}

async function Tiktok(query) {
  let response = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });

  let result = {};
  result.creator = "YNTKTS";
  result.title = clean(response.data.desc);
  result.author = clean(response.data.author);
  result.nowm = await shortener(
    (response.data.links[0].a || "").replace("https", "http")
  );
  result.watermark = await shortener(
    (response.data.links[1].a || "").replace("https", "http")
  );
  result.audio = await shortener(
    (response.data.links[2].a || "").replace("https", "http")
  );
  result.thumbnail = await shortener(response.data.cover);
  return result;
}

async function ttimg(link) {
  try {
    let url = `https://dlpanda.com/es?url=${link}&token=G7eRpMaa`;
    let response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    let imgSrc = [];
    $('div.col-md-12 > img').each((index, element) => {
      imgSrc.push($(element).attr('src'));
    });
    if (imgSrc.length === 0) {
      return { data: '*[❗] No se encontraron imágenes en el enlace proporcionado.*' };
    }
    return { data: imgSrc };
  } catch (error) {
    console.error(error);
    return { data: '*[❗] No se obtuvo respuesta de la página, intente más tarde.*' };
  }
}

// Plugin Handler
const handler = async (m, { args, conn }) => {
  if (!args[0]) throw '*[❗] Por favor proporciona un enlace de TikTok.*';
  const query = args[0];

  try {
    // Obtener información de TikTok
    const result = await Tiktok(query);

    let message = `╭─⬣「 *TikTok Downloader* 」⬣\n`;
    message += `│ ✦ *Título:* ${result.title}\n`;
    message += `│ ✦ *Autor:* ${result.author}\n`;
    message += `│ ✦ *Sin Marca de Agua:* ${result.nowm}\n`;
    message += `│ ✦ *Con Marca de Agua:* ${result.watermark}\n`;
    message += `│ ✦ *Audio:* ${result.audio}\n`;
    message += `╰─⬣`;

    // Enviar mensaje con resultados
    await conn.sendMessage(m.chat, {
      image: { url: result.thumbnail },
      caption: message
    }, { quoted: m });

    // Enviar el video sin marca de agua
    await conn.sendMessage(m.chat, {
      video: { url: result.nowm },
      caption: '*Aquí está tu video sin marca de agua.*'
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('*[❗] Hubo un error al procesar tu solicitud.*');
  }
};

handler.help = ['tiktok <url>'];
handler.tags = ['downloader'];
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm'];
handler.register = true;

export default handler;
