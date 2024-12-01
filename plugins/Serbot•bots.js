import { jidNormalizedUser } from "@adiwajshing/baileys";
import ws from 'ws';
import Jadibots from "../lib/jadibots.js";

let handler = async (m, { conn, usedPrefix }) => {
    try {
        // Obtener la lista de bots registrados con Jadibots
        const users = [...Jadibots.conns.entries()].map(([_, v]) => v.user);
        const totalUsers = users.length;

        // Verificar las conexiones activas y únicas
        let uniqueUsers = new Map();
        global.conns.forEach((conn) => {
            if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
                uniqueUsers.set(conn.user.jid, conn);
            }
        });

        const activeUsers = [...uniqueUsers.values()];
        const totalActive = activeUsers.length;

        // Generar las listas
        const jadibotsList = users.map((user, i) =>
            `✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] || jidNormalizedUser(user?.id)?.split?.("@")?.[0] || user?.id}` +
            `${user?.name ? ` (${user.name})` : ''}\n✦ https://wa.me/${parseInt(user?.jid || jidNormalizedUser(user?.id))}?text=${usedPrefix}menu`
        ).join('\n');

        const activeList = activeUsers.map((v, i) =>
            `╭─⬣「 Sub-Bot Activo 」⬣\n` +
            `│⁖ *${i + 1}.* @${v.user.jid.replace(/[^0-9]/g, '')}\n` +
            `│❀ *Nombre:* ${v.user.name || '𝚂𝚄𝙱-𝙱𝙾𝚃'}\n` +
            `│❀ *Link:* https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}\n` +
            `╰─⬣`
        ).join('\n\n');

        // Construir el mensaje final
        const finalMessage = `
╭━〔 𝗦𝗨𝗕𝗕𝗢𝗧𝗦 𝗝𝗔𝗗𝗜𝗕𝗢𝗧 〕⬣
┃ ✧ *Total Registrados:* ${totalUsers || '0'}
┃ ✧ *Total Activos:* ${totalActive || '0'}
╰━━━━━━━━━━━━⬣

*Lista de Sub-Bots Registrados:*
${totalUsers > 0 ? jadibotsList : '✦ No hay subbots registrados.'}

*Lista de Sub-Bots Activos:*
${totalActive > 0 ? activeList : '✦ No hay conexiones activas.'}
`.trim();

        // Enviar el mensaje
        await conn.sendMessage(m.chat, { text: finalMessage, mentions: conn.parseMention(finalMessage) }, { quoted: m });
    } catch (e) {
        console.error(e);
        await m.reply('Ocurrió un error al procesar la lista de Sub-Bots.');
    }
};

handler.help = ['listjadibot', 'bots'];
handler.tags = ['jadibot'];
handler.command = /^(list(jadi)?bot|(jadi)?botlist|bots)$/i;

export default handler;
