import { jidNormalizedUser } from "@adiwajshing/baileys";
import Jadibots from "../lib/jadibots.js";

let handler = async (m, { usedPrefix }) => {
    try {
        // Obtener la lista de sub-bots desde Jadibots
        const users = [...Jadibots.conns.entries()].map(([_, v]) => v.user);

        // Si no hay sub-bots, envía mensaje informativo
        if (!users.length) {
            return m.reply("✦ No hay subbots por ahora.");
        }

        // Construir el mensaje con la lista de sub-bots
        const text = `
╭━〔 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦 〕⬣
┃ *𝗧𝗢𝗧𝗔𝗟 𝗗𝗘 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦:* ${users.length}
┃
${users.map((user, i) => 
`┃ ✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] || jidNormalizedUser(user?.id)?.split?.("@")?.[0] || user?.id}
┃   ◦ *Nombre:* ${user?.name || 'Sin nombre'}
┃   ◦ *Link:* https://wa.me/${parseInt(user?.jid || jidNormalizedUser(user?.id))}?text=${usedPrefix}estado`
).join('\n')}
╰━━━━━━━━━━━━━━━━━━⬣
        `.trim();

       
        await m.reply(text);
    } catch (e) {
        console.error(e);
        m.reply("Ocurrió un error al procesar la lista de Sub-Bots.");
    }
};

// Información del comando
handler.help = ['jadibot'];
handler.tags = ['Serbot'];
handler.command = /^bots|(jadi)?botlist)$/i;

export default handler;
