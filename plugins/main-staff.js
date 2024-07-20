let handler = async (m, { conn, command, usedPrefix }) => {
let pp = icons
let img = 'https://qu.ax/vQmu.jpg'
let staff = `⁖🩵꙰  *EQUIPO DE AYUDANTES*
⁖🧡꙰  *Bot:* ${global.botname}
⁖💜꙰  *Versión:* ${global.vs}

👑 *Propietario:*

• Ofc
☘️ *Rol:* Propietario
✨️ *Número:* ${creador}
🏆 *GitHub:* https://github.com/Alba70503

⁖❤️꙰  *Colaboradores:*

• ArizzVal
☘️ *Rol:* Developer
✨️ *Número:* Wa.me/5215610314499
🏆 *GitHub:* https://github.com/KatashiFukushima`
await conn.sendFile(m.chat, pp, 'luffy.jpg', staff.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `🥷 Developers 👑`,
body: `💭 Staff Oficial`,
mediaType: 1,
sourceUrl: redes,
thumbnailUrl: img
}}
}, { mentions: m.sender })
m.react('🌟')

}
handler.help = ['staff']
handler.command = ['colaboradores', 'staff']
handler.register = true
handler.tags = ['main']

export default handler
