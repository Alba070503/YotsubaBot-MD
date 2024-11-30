import Scraper from '@SumiFX/Scraper'
import axios from 'axios'
import fetch from 'node-fetch'



let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`🍭 Ingresa un enlace del video de TikTok junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://vm.tiktok.com/ZMMCYHnxf/`)

    try {
        // Intentar con Scraper API
        let { title, published, likes, commentCount, shareCount, views, dl_url } = await Scraper.tiktokdl(args[0])

        let txt = `╭─⬣「 *TikTok Download* 」⬣\n`
            txt += `│  ≡◦ *🍭 Título* : ${title}\n`
            txt += `│  ≡◦ *📅 Publicado* : ${published}\n`
            txt += `│  ≡◦ *👍 Likes* : ${likes}\n`
            txt += `│  ≡◦ *🗣 Comentarios* : ${commentCount}\n`
            txt += `│  ≡◦ *💫 Share* : ${shareCount}\n`
            txt += `│  ≡◦ *📹 Visitas* : ${views}\n`
            txt += `╰─⬣`

        await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: txt }, { quoted: m })
    } catch {
        try {
            // Intentar con Starlights API
            const api = await fetch(`https://api-starlights-team.koyeb.app/api/tiktok?url=${args[0]}`)
            const data = await api.json()

            if (data.status) {
                const { title, video } = data.data
                let txt = `╭─⬣「 *TikTok Download* 」⬣\n`
                    txt += `│  ≡◦ *🍭 Título* : ${title}\n`
                    txt += `╰─⬣`

                await conn.sendMessage(m.chat, { video: { url: video }, caption: txt }, { quoted: m })
            }
        } catch {
            try {
                // Intentar con Delirius API
                const api1 = await fetch(`https://delirius-api-oficial.vercel.app/api/tiktok?url=${args[0]}`)
                const data1 = await api1.json()

                if (data1.status) {
                    const { title, meta } = data1.data
                    const videoUrl = meta.media.find(v => v.quality === 'HD')?.org || meta.media[0].org

                    let txt = `╭─⬣「 *TikTok Download* 」⬣\n`
                        txt += `│  ≡◦ *🍭 Título* : ${title}\n`
                        txt += `╰─⬣`

                    await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: txt }, { quoted: m })
                }
            } catch {
                m.reply('⚠️ No se pudo descargar el video. Intenta nuevamente más tarde.')
            }
        }
    }
}

handler.help = ['tiktok <url tt>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm']
handler.register = true

export default handler
