import { search, download } from 'aptoide-scraper'

var handler = async (m, {conn, usedPrefix, command, text}) => {

if (!text) return conn.reply(m.chat, '🚩 *Ingrese el nombre de la apk para descargarlo.*', m, rcanal)

try {

conn.reply(m.chat, wait, m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: wm,
previewType: 0, thumbnail: icons,
sourceUrl: channel }}})

let searchA = await search(text)
let data5 = await download(searchA[0].id)
let response = `☄️ Descargador De Aptoide 📲\n\n🪐 *Nombre:* ${data5.name}\n🚩 *Package:* ${data5.package}\n🎌 *Actualización:* ${data5.lastup}\n☁️ *Tamaño:* ${data5.size}`
//await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', response, m, null, rcanal)
await conn.sendMessage(m.chat, { text: response, contextInfo: { externalAdReply: { title: data5.name, body: wm, sourceUrl: md, thumbnailUrl: data5.icon, mediaType: 1, showAdAttribution: true, renderLargerThumbnail: true }}} , { quoted: fkontak })   

 if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.reply(m.chat, '🛑 *El archivo es demaciado pesado*', m, rcanal )
}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: m})
} catch {
return conn.reply(m.chat, '🛑 *Ocurrió un fallo*', m, rcanal )
}    
}

handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = /^(apkmod|apk|dapk2|aptoide|aptoidedl)$/i

export default handler
