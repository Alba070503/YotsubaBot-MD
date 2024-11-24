import { jidNormalizedUser } from "@adiwajshing/baileys";
import Jadibots from "../lib/jadibots.js";
let handler = async (m, { usedPrefix }) => {
    const users = [...Jadibots.conns.entries()].map(([k, v]) => v.user);
    if (!users.length) throw m.reply("✦ No hay subbots por ahora.")
    const text = `
*Lista de Jadibots*

${users.map((user, i) => `✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] ?? jidNormalizedUser(user?.id)?.split?.("@")?.[0] ?? user?.id}${user?.name ? ` (${user.name})` : ''}\n✦   https://wa.me/${parseInt(user?.jid ?? jidNormalizedUser(user?.id))}?text=${usedPrefix}menu`).join('\n')}
`;
    await m.reply(text.trim());
};

handler.help = ['listjadibot'];
handler.tags = ['jadibot'];
handler.command = /^(list(jadi)?bot|(jadi)?botlist)$/i;

export default handler;
