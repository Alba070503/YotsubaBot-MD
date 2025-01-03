/*
❀ Plugin creado por @Alba070503
*/


import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
if (!text) {
return m.reply("❀ ingresa un texto de lo que quieres buscar")
}
    
let ytres = await search(args.join(" "))
let txt = `- *Título* : ${ytres[0].title}
- *Duración* : ${ytres[0].timestamp}
- *Publicado* : ${ytres[0].ago}
- *Canal* : ${ytres[0].author.name || 'Desconocido'}
- *Url* : ${'https://youtu.be/' + ytres[0].videoId}`
await conn.sendFile(m.chat, ytres[0].image, 'thumbnail.jpg', txt, m, rcanal)
    
try {
let api = await fetch(`https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${ytres[0].url}`)
let json = await api.json()
let { quality, title, download_url } = json.result
await conn.sendMessage(m.chat, { video: { url: download_url }, caption: `${title}`, mimetype: 'video/mp4', fileName: `${title}` + `.mp4`}, {quoted: m })
} catch (error) {
console.error(error)
}}

handler.command = /^(play2)$/i

export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return search.videos
}
