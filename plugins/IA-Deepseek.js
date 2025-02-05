//* ౨ৎ ˖ ࣪⊹ 𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 @Alba070503 𐙚˚.ᡣ𐭩

import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, '❀ *DeepSeek AI* 🤖\n\nPor favor, ingresa un texto para hablar conmigo.', m);
  }

  try {
    let { data } = await axios.get(`https://archive-ui.tanakadomp.biz.id/ai/deepseek?text=${encodeURIComponent(text)}`);

    if (data && data.result) {
      let response = `✨ *Respuesta de DeepSeek AI* ✨\n\n` +
                     `🗨️ *Tu mensaje:* ${text}\n\n` +
                     `💬 *DeepSeek dice:* ${data.result}\n\n` +
                     `🔍 *Fuente:* DeepSeek AI\n` +
                     `📅 *Fecha:* ${new Date().toLocaleString()}\n\n` +
                     `🌐 *Desarrollado por:* @Alba070503`;

      await conn.sendMessage(m.chat, { text: response, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
    } else {
      await conn.reply(m.chat, '⚠️ DeepSeek AI no pudo generar una respuesta en este momento.', m);
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '❌ *Error:* Hubo un problema al procesar tu solicitud.', m);
  }
};

handler.command = ['deepseek', 'ai3'];

export default handler;
