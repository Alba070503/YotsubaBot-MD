import fetch from 'node-fetch';
import { cpus as _cpus } from 'os';
import { sizeFormatter } from 'human-readable';

let format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

let handler = async (m, { conn }) => {
  try {
    // Obtener información del sistema
    let uptime = clockString(process.uptime() * 1000);
    let totalreg = Object.keys(global.db.data.users).length || 0;
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const used = process.memoryUsage();

    // Crear el mensaje de estado
    let menu = `🍀 *I N F O - Y O T S U B A*
    
*_ESTADO_*
🍁 ⋄ Chats de grupo: *${groupsIn.length}*
🌸 ⋄ Grupos unidos: *${groupsIn.length}*
🍁 ⋄ Grupos abandonados: *0*
🌸 ⋄ Chats privados: *${chats.length - groupsIn.length}*
🍁 ⋄ Total Chats: *${chats.length}*
🌸 ⋄ Registrados: *${totalreg}*
🍁 ⋄ Tiempo Activo: *${uptime}*

🌼 *NodeJS Uso de memoria*
${'```' + Object.keys(used).map((key) => `${key.padEnd(10, ' ')}: ${format(used[key])}`).join('\n') + '```'}
`;

    // Enviar el mensaje enriquecido con externalAdReply
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '❑— YotsubaBot-MD —❑\nWʜᴀᴛꜱᴀᴘᴘ Bᴏᴛ - Mᴜʟᴛɪ Dᴇᴠɪᴄᴇ',
          thumbnailUrl: 'https://qu.ax/ilnry.jpg', // Imagen como URL
          sourceUrl: 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04', // URL externa
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });

    // Reaccionar al mensaje original
    if (m.react) await m.react('🤖');

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al procesar el comando.');
  }
};

handler.help = ['info'];
handler.tags = ['info'];
handler.command = ['info', 'infobot', 'botinfo'];

export default handler;

// Función para calcular tiempo activo en formato hh:mm:ss
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
