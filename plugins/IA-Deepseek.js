import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❀ Ingresa un texto para hablar con DeepSeek');

  try {
    let response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: text }],
      },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lancelotgames.com', // Puedes cambiarlo a tu sitio
          'X-Title': 'LancelotGamesBot',
        },
      }
    );

    let replyText = response.data.choices[0].message.content;
    m.reply(`🧠 *DeepSeek AI*\n\n🖥️ *Respuesta:* ${replyText}\n\n✨ *Creado por @Alba070503*`);

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error: ${error.response?.data?.error?.message || 'No se pudo obtener respuesta'}`);
  }
};

handler.command = ['deepseek'];

export default handler;
