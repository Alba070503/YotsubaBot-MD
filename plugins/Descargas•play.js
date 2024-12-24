/**
© ZENITH
ᘎ https://whatsapp.com/channel/0029Vai9MMj5vKABWrYzIJ2Z
*/
import fetch from "node-fetch"
import yts from "yt-search"

let handler = async (m, { conn, args }) => {
  const text = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || ""
  if (!text.trim()) return m.reply("Masukkan kata kunci pencarian")
  await m.reply("Tunggu sebentar...")

  const res = await yts(text)
  const vid = res.videos[0]
  if (!vid) return m.reply("Video tidak ditemukan. Silakan coba kata kunci lain")

  const { title, thumbnail, timestamp, views, ago, url } = vid
  const formattedViews = parseInt(views).toLocaleString("id-ID") + " tayangan"
  const captvid = `*Judul:* ${title}\n*Durasi:* ${timestamp}\n*Views:* ${formattedViews}\n*Upload:* ${ago}\n*Link:* ${url}`

  const ytthumb = (await conn.getFile(thumbnail))?.data

  const infoReply = {
    contextInfo: {
      externalAdReply: {
        body: "Sedang mengunduh hasil, harap tunggu...",
        mediaType: 1,
        mediaUrl: url,
        previewType: 0,
        renderLargerThumbnail: true,
        sourceUrl: url,
        thumbnail: ytthumb,
        title: "Y O U T U B E - P L A Y"
      }
    }
  }

  await conn.reply(m.chat, captvid, m, infoReply)

  const apiRes = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${url}`)
  const json = await apiRes.json()

  if (json.status) {
    const { result } = json
    const { download } = result
    await conn.sendMessage(m.chat, {
      audio: { url: download.url },
      caption: `*Judul:* ${title}\n*Ukuran File:* ${download.size}\n*Kualitas:* ${download.quality}`,
      mimetype: "audio/mpeg",
      contextInfo: infoReply.contextInfo
    }, { quoted: m })
  } else {
    await m.reply("Gagal mengunduh audio")
  }
}

handler.help = ["play <pencarian>"]
handler.tags = ["downloader"]
handler.command = /^(play|ytplay)$/i
handler.limit = true

export default handler,
