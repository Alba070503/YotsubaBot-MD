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
    // Cargar imagen del enlace proporcionado
    let img = await (await fetch('https://telegra.ph/file/b7edf2026656718c1f0f7.jpg')).buffer();

    // Obtener información del sistema
    let uptime = clockString(process.uptime() * 1000);
    let totalreg = Object.keys(global.db.data.users).length;
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const used = process.memoryUsage();

    // Generar contenido del mensaje
    let menu = `🍭 *I N F O - Y A E M O R I*
    
*_ESTADO_*
🐢͜͡ޮ ⋄ Chats de grupo: *${groupsIn.length}*
🌺͜͡ޮ ⋄ Grupos unidos: *${groupsIn.length}*
🐢͜͡ޮ ⋄ Grupos abandonados: *${groupsIn.length - groupsIn.length}*
🌺͜͡ޮ ⋄ Chats privados: *${chats.length - groupsIn.length}*
🐢͜͡ޮ ⋄ Total Chats: *${chats.length}*
🌺͜͡ޮ ⋄ Registrados: *${totalreg}*
🐢͜͡ޮ ⋄ Tiempo Activo: *${uptime}*

🚩 *NodeJS Uso de memoria*
${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}
`;

    // Enviar el mensaje con el thumbnail y enlace
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: { 
        mentionedJid: [m.sender],
        forwardingScore: 9, 
        externalAdReply: {
          title: '❑— ShizukaBot-MD —❑\nWʜᴀᴛꜱᴀᴘᴘ Bᴏᴛ - Mᴜʟᴛɪ Dᴇᴠɪᴄᴇ',
          thumbnail: img,
          sourceUrl: 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    // Reaccionar al mensaje original
    await m.react('🤖');

  } catch (e) {
    console.error(e);
  }
};

handler.help = ['info'];
handler.tags = ['info'];
handler.command = ['info', 'infobot', 'botinfo'];

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}
