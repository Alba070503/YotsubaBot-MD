import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

  global.getBuffer = async function getBuffer(url, options = {}) {
    try {
      var res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`Error : ${e}`)
    }
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  global.fotoperfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/QGAVS.jpg')
  let api = await axios.get(`https://deliriussapi-oficial.vercel.app/tools/country?text=${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}`)
  let userNationalityData = api.data.result
  global.pais = userNationalityData ? `${userNationalityData.name} ${userNationalityData.emoji}` : 'Desconocido'
  let user = global.db.data.users[who]
  let pushname = m.pushName || 'Sin nombre'

  // Creador y otros
  global.channelid = '120363305941657414@newsletter'
  global.creador = 'Wa.me/59169082575'
  global.ofcbot = `${conn.user.jid.split('@')[0]}`
  global.asistencia = 'https://wa.me/message/O4QPPHZOFDOJI1'
  global.namechannel = '© All Right Reserved • YotsubaBot-MD'

  // Reacciones de comandos
  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'

  // Emojis determinado de Ai Yaemori
  global.emoji = '🚩'
  global.emoji2 = '🍟'
  global.emoji3 = '✨️'
  global.emoji4 = '🍭'
  global.emojis = [global.emoji, global.emoji2, global.emoji3, global.emoji4].sort(() => Math.random() - 0.5)[0] // Aleatorio

  // Mensajes de espera
  global.wait = '🚀 Cargando...'
  global.waitt = global.wait
  global.waittt = global.wait
  global.waitttt = global.wait

  // Enlaces
  var canal = 'https://whatsapp.com/channel/0029VaQD7LAJP216tu9liI2A'  
  var canal2 = 'https://whatsapp.com/channel/0029Vam7yUg77qVaz3sIAp0z'
  var git = 'https://github.com/Alba070503' 
  var youtube = 'https://www.youtube.com/@alba0705o3' 
  var github = 'https://github.com/Alba070503/YotsubaBot-MD'  
  var panel = 'https://panel.skyultraplus.com'
  var dash = 'https://dash.skyultraplus.com'
  var tienda = 'https://dash.skyultraplus.com/store'
  var status = 'https://estado.skyultraplus.com'
  var discord = 'https://discord.com/invite/T7ksHu7mkz'
  var paypal = 'https://paypal.me/corinplus2024'
  let tiktok = 'https://tiktok.com/@dev_diego'
  let correo = 'theyaemoribot@gmail.com'

  global.redes = [canal, canal2, git, youtube, github, panel, dash, tienda, status, discord, paypal, tiktok, correo].sort(() => Math.random() - 0.5)[0]
  global.redeshost = [panel, dash, tienda, status, discord, paypal].sort(() => Math.random() - 0.5)[0]

  // Imagen
  let category = "imagen"
  const db = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(db))
  const random = Math.floor(Math.random() * db_.links[category].length)
  const randomlink = db_.links[category][random]
  const response = await fetch(randomlink)
  const rimg = await response.buffer()
  global.icons = rimg

  // • ↳ ◜𝑻𝑰𝑬𝑴𝑷𝑶 𝑹𝑷𝑮◞ • ⚔
  var ase = new Date(); 
  var hour = ase.getHours(); 
  switch (hour) {
    case 0: case 1: case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
    case 3: case 4: case 5: case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break;
    case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break;
    case 8: case 9: case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break;
    case 11: case 12: case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break;
    case 14: case 15: case 16: case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break;
    default: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
  }
  global.saludo = hour

  // Tags
  global.nombre = conn.getName(m.sender)
  global.taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
  var more = String.fromCharCode(8206)
  global.readMore = more.repeat(850)

  // Fakes
  global.fkontak = { 
    key: { participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, 
    message: { 'contactMessage': { 
      'displayName': `${pushname}`, 
      'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 
      'jpegThumbnail': null, 
      thumbnail: null,
      sendEphemeral: true
    }}
  }

  // Global estilo modificado para evitar errores
  global.fake = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: '120363198641161536@newsletter', 
        newsletterName: namechannel, 
        serverMessageId: -1 
      }
    }, 
    quoted: m 
  }

  global.rpl = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: "120363198641161536@newsletter", 
        serverMessageId: 100, 
        newsletterName: namechannel, 
      }, 
      externalAdReply: { 
        mediaUrl: global.redes, 
        mediaType: 'VIDEO', 
        description: namebot, 
        title: packname, 
        body: namebot, 
        thumbnailUrl: global.icons, 
        sourceUrl: global.redes 
      }
    }
  }

  global.icono = [
    'https://qu.ax/wtOta.jpg',
    'https://qu.ax/NNXXP.jpg',
    'https://qu.ax/eGhSJ.jpg'
  ].sort(() => Math.random() - 0.5)[0]

  global.rcanal = { 
    contextInfo: { 
      isForwarded: true, 
      forwardedNewsletterMessageInfo: { 
        newsletterJid: "120363198641161536@newsletter", 
        serverMessageId: 100, 
        newsletterName: namechannel, 
      }, 
      externalAdReply: { 
        showAdAttribution: true, 
        title: namebot, 
        body: dev, 
        mediaUrl: null, 
        description: null, 
        previewType: "PHOTO", 
        thumbnailUrl: global.icono, 
        sourceUrl: global.redes, 
        mediaType: 1, 
        renderLargerThumbnail: false 
      }
    }
  }

}
export default handler
