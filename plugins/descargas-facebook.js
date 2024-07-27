import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
let enviando = false;

const handler = async (m, {conn, args, command, usedPrefix}) => {

  if (!args[0]) {
    throw `_*< DESCARGAS - FACEBOOK />*_\n\n*[ ℹ️ ] Ingrese un enlace de Facebook.*\n\n*[ 💡 ] Ejemplo:* _${usedPrefix + command} https://fb.watch/fOTpgn6UFQ/_`;
  }

  /*const linkface = await isValidFacebookLink(args[0]);
  if (!linkface) {
    throw `_*${tradutor.texto2[0]}*_\n\n*${tradutor.texto2[1]}*\n\n*${tradutor.texto2[2]}* _${usedPrefix + command} https://fb.watch/fOTpgn6UFQ/_`;
  }*/

  if (!enviando) enviando = true;
  try {
    await m.reply(`_*< DESCARGAS - FACEBOOK />*_\n\n*[ ℹ️ ] Se está enviando el video. espere...*`);
    
    const response = await fetch(`${global.MyApiRestBaseUrl}/api/facebook?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
    const data = await response.json();

    if (data?.status === true) {
      const videoBuffer = await getBuffer(data.resultado.data);
      await conn.sendMessage(m.chat, {
        video: videoBuffer, 
        filename: 'video.mp4', 
        caption: `_*< DESCARGAS - FACEBOOK />*_`
      }, {quoted: m});
      enviando = false;
    } else {
      console.error('Failed to fetch video data from API:', data);
      enviando = false;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    enviando = false;
    throw `_*< DESCARGAS - FACEBOOK />*_\n\n*[ ℹ️ ] Ocurrió un error. Por favor, inténtalo de nuevo más tarde.*`;
  }
};

handler.command = /^(facebook|fb|facebookdl|fbdl|facebook2|fb2|facebookdl2|fbdl2|facebook3|fb3|facebookdl3|fbdl3|facebook4|fb4|facebookdl4|fbdl4|facebook5|fb5|facebookdl5|fbdl5)$/i;
export default handler;

/*async function isValidFacebookLink(link) {
  const validPatterns = [
    /facebook\.com\/[^/]+\/videos\//i, 
    /fb\.watch\//i, 
    /fb\.com\/watch\//i, 
    /fb\.me\//i, 
    /fb\.com\/video\.php\?v=/i, 
    /facebook\.com\/share\/v\//i, 
    /facebook\.com\/share\/r\//i, 
    /fb\.com\/share\/v\//i, 
    /fb\.com\/share\/r\//i, 
    /facebook\.com\/[^/]+\/posts\/[^/]+\//i, 
    /facebook\.com\/reel\/[^/]+\//i,
    /facebook\.com\/watch\/[^/]+\//i  
  ];
  return validPatterns.some(pattern => pattern.test(link));
}*/

const getBuffer = async (url, options = {}) => {
  const res = await axios({
    method: 'get', 
    url, 
    headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1},
    ...options, 
    responseType: 'arraybuffer'
  });
  return res.data;
};
