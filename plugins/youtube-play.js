import fg from 'api-dylux'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import yts from 'yt-search'
import fetch from 'node-fetch' 

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    if (!text) return conn.reply(m.chat, `*🚩 Ingresa el título de un video o música de YouTube.*`, m)

    try {
        await m.react('🕓')
        let res = await yts(text)
        let vid = res.videos[0]
        
        if (!vid) return conn.reply(m.chat, `*☓ No se encontraron resultados para tu búsqueda.*`, m)

        const limit = 100
        let q = command.includes('mp4') ? '360p' : '128kbps'
        let dl_url, size, title
        
        if (command === 'mp3') {
            let yt = await fg.yta(vid.url, q)
            dl_url = yt.dl_url
            size = yt.size.split('MB')[0]
            title = yt.title
        } else if (command === 'mp4') {
            let yt = await fg.ytv(vid.url, q)
            dl_url = yt.dl_url
            size = yt.size.split('MB')[0]
            title = yt.title
        }

        if (size >= limit) {
            return conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m).then(_ => m.react('✖️'))
        }

        if (command === 'mp3') {
            await conn.sendMessage(m.chat, { 
                audio: { url: dl_url }, 
                mimetype: "audio/mpeg", 
                fileName: `${title}.mp3`, 
                quoted: m, 
                contextInfo: {
                    'forwardingScore': 200,
                    'isForwarded': true,
                    externalAdReply:{
                        showAdAttribution: false,
                        title: `${title}`,
                        body: `${vid.author.name}`,
                        mediaType: 2, 
                        sourceUrl: `${vid.url}`,
                        thumbnail: await (await fetch(vid.thumbnail)).buffer()
                    }
                }
            }, { quoted: m })
        } else if (command === 'mp4') {
            await conn.sendMessage(m.chat, { 
                video: { url: dl_url }, 
                caption: `${title}\n⇆ㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤ↻\n00:15 ━━━━●────── ${vid.timestamp}`, 
                mimetype: 'video/mp4', 
                fileName: `${title}.mp4`, 
                quoted: m, 
                contextInfo: {
                    'forwardingScore': 200,
                    'isForwarded': true,
                    externalAdReply:{
                        showAdAttribution: false,
                        title: `${title}`,
                        body: `${vid.author.name}`,
                        mediaType: 2, 
                        sourceUrl: `${vid.url}`,
                        thumbnail: await (await fetch(vid.thumbnail)).buffer()
                    }
                }
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, `*☓ Ocurrió un error inesperado.*`, m).then(_ => m.react('✖️'))
    }
}

handler.help = ["play"].map(v => v + " <formato> <búsqueda>")
handler.tags = ["downloader"]
handler.command = ['play', 'play2', 'mp3', 'mp4', 'mp3doc', 'mp4doc']
handler.register = true 
handler.star = 1

export default handler
