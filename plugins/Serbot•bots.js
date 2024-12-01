import { jidNormalizedUser } from "@adiwajshing/baileys";
import ws from 'ws';
import Jadibots from "../lib/jadibots.js";

let handler = async (m, { conn, usedPrefix }) => {
    // Obtener sub-bots registrados con Jadibots
    const users = [...Jadibots.conns.entries()].map(([k, v]) => v.user);
    if (!users.length) return m.reply("✦ No hay subbots por ahora.");

    // Verificar conexiones activas y únicas
    let uniqueUsers = new Map();
    global.conns.forEach((conn) => {
        if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
            uniqueUsers.set(conn.user.jid, conn);
        }
    });

    let activeUsers = [...uniqueUsers.values()];
    let totalActiveUsers = activeUsers.length;

    // Generar el mensaje para Jadibots y conexiones activas
    let jadibotsList = users.map((user, i) =>
        `✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] ?? jidNormalizedUser(user?.id)?.split?.("@")?.[0] ?? user?.id}` +
        `${user?.name ? ` (${user.name})` : ''}\n✦ https://wa.me/${parseInt(user?.jid ?? jidNormalizedUser(user?.id))}?text=${usedPrefix}menu`
    ).join('\n');

    let activeList = activeUsers.map((v, index) =>
        `╭─⬣「 Sub-Bot Activo 」⬣\n` +
        `│⁖ *${index + 1}.* @${v.user.jid.replace(/[^0-9]/g, '')}\n` +
        `│❀ *Nombre:* ${v.user.name || '𝚂𝚄𝙱-𝙱𝙾𝚃'}\n` +
        `│❀ *Link:* https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}\n` +
        `╰─⬣`
    ).join('\n\n');

    // Mensaje final
    let finalMessage = `
*Lista de Sub-Bots* (${users.length || '0'} registrados)
${jadibotsList}

*Lista de Conexiones Activas* (${totalActiveUsers || '0'} activas)
${activeList}
`.trim();

    // Enviar mensaje al chat
    await conn.sendMessage(m.chat, { text: finalMessage, mentions: conn.parseMention(finalMessage) }, { quoted: m });
};

handler.help = ['bots'];
handler.tags = ['serbots'];
handler.command = ['listjadibot', 'bots']
export default handler;
