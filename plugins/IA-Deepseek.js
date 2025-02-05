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
        },
      }
    );

    let replyText = response.data.choices[0].message.content;
    m.reply(`🧠 *DeepSeek AI*\n\n🖥️ *Respuesta:* ${replyText}\n\n✨ *Creado por @Alba070503*`);

  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar la solicitud.');
  }
};

handler.command = ['deepseek'];

export default handler;
