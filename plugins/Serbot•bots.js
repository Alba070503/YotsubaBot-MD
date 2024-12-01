import { jidNormalizedUser } from "@adiwajshing/baileys";
import ws from 'ws';
import Jadibots from "../lib/jadibots.js";

let handler = async (m, { conn: stars, usedPrefix }) => {
    // Obtener sub-bots activos usando Jadibots
    const users = [...Jadibots.conns.entries()].map(([k, v]) => v.user);
    if (!users.length) throw m.reply("✦ No hay subbots por ahora.");

    // Verificar conexiones únicas
    let uniqueUsers = new Map();
    global.conns.forEach((conn) => {
        if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
            uniqueUsers.set(conn.user.jid, conn);
        }
    });

    let activeUsers = [...uniqueUsers.values()];
    let totalUsers = activeUsers.length;

    // Generar el mensaje combinado
    let message = activeUsers.map((v, index) => 
        `╭─⬣「 Sub-Bot 」⬣\n` +
        `│⁖ฺ۟̇࣪·֗٬̤⃟🚩 *${index + 1}.-* @${v.user.jid.replace(/[^0-9]/g, '')}\n` +
        `│❀ *Link:* https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}\n` +
        `│❀ *Nombre:* ${v.user.name || '𝚂𝚄𝙱-𝙱𝙾𝚃'}\n` +
        `╰─⬣`).join('\n\n');

    let listMessage = `
*Lista de Sub-Bots Activos* (${totalUsers || '0'} en total)

${users.map((user, i) => `✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] ?? jidNormalizedUser(user?.id)?.split?.("@")?.[0] ?? user?.id}${user?.name ? ` (${user.name})` : ''}\n✦   https://wa.me/${parseInt(user?.jid ?? jidNormalizedUser(user?.id))}?text=${usedPrefix}menu`).join('\n')}

${message}
`.trim();

    // Enviar el mensaje al chat
    await stars.sendMessage(m.chat, { text: listMessage, mentions: stars.parseMention(listMessage) }, { quoted: m });
};

handler.help = ['listjadibot'];
handler.tags = ['jadibot'];
handler.command = /^(list(jadi)?bot|(jadi)?botlist|bots)$/i;

export default handler;
