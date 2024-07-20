let handler = async (m, { conn, command }) => {
if (command === 'infinity') {
let txt = `🥲 No estamos en Infinity-Host 🥲`
/*let txt = `*INFINITY HOST* 🚩
*¿Quieres un hosting para poner tu Bot y no sabes cual usar?*
Pues te presento a *Infinity Host*, un hosting que te ofrece una gran variedad de servicios para poner tus proyectos y que estos estén 24/7 Activos.

🔵 \`\`\`Información del Host\`\`\`

🏳 *PRECIOS*
- *1GB, 100CPU* = 1dolar
- *2GB, 120CPU* = 2dolar
- *3GB, 140CPU* = 3dolar
- *4GB, 175CPU* = 4dolar
- *5GB, 200CPU* = 5dolar

💥 *Página:* https://www.infinity-wa.xyz

✨️ *Dashboard:* https://dashboard.infinitywa.xyz

💫 *Panel:* https://store.panel-infinitywa.store

🚩 *Discord:* https://discord.com/invite/vgfpe4Nwd8

😺 *Grupo:* https://chat.whatsapp.com/GQ82mPnSYnm0XL2hLPk7FV

*¿Qué esperas para Adquirir sus servicios? Únete a esta familia :)*`*/
await conn.sendMessage(m.chat, { text: txt,
contextInfo:{
forwardingScore: 1,
isForwarded: false, 
"externalAdReply": {
"showAdAttribution": true,
"containsAutoReply": true,
"title": `♾️ INFINITY - HOST ♾️`,
"body": `✅ HOSTIN DE CALIDAD ✅`,
"previewType": "PHOTO",
"thumbnailUrl": 'https://qu.ax/EQTd.jpg', 
"sourceUrl": 'https://dashboard.infinitywa.xyz'}}},
{ quoted: fkontak})
}
if (command === 'flarex') {
let txt = `*FLAREX CLOUD* 🚩
*¿Quieres un Host de calidad y con bajos precios?*
Pues te presento a *FlarexCloud*, un hosting de calidad con servidores dedicados y precios por debajo de 1USD, estos servidores están destinados a ofrecerte un Uptime 24/7 para que puedas alojar tus proyectos y qué estos funcionen de manera eficaz.

🟢 \`\`\`Información del Host\`\`\`

💫 *Página:* https://www.flarex.cloud

💙 *Game Panel:* https://gamepanel.flarex.cloud

☁️ *Discord:* https://discord.flarex.cloud

🤍 *Grupo:* https://whatsapp.flarex.cloud

> *Únete a está comunidad y disfruta de un servicio de calidad :D*`
await conn.sendMessage(m.chat, { text: txt,
contextInfo:{
forwardingScore: 1,
isForwarded: false, 
"externalAdReply": {
"showAdAttribution": true,
"containsAutoReply": true,
"title": `🟣 FLAREX CLOUD 🟣`,
"body": `✅ HOSTIN DE CALIDAD ✅`,
"previewType": "PHOTO",
"thumbnailUrl": 'https://telegra.ph/file/8f789f212b6cd978cd45d.jpg', 
"sourceUrl": 'https://www.flarex.cloud'}}},
{ quoted: fkontak})
}
}
handler.tags =['main'] 
handler.help = ['flarex'] 
handler.command = ['infinty', 'flarex']
handler.register = true
export default handler