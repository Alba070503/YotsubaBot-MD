import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': 'MENÚ - INFO',
  'buscador': 'MENÚ - BUSQUEDAS',
  'fun': 'MENÚ - JUEGOS',
  'gacha': 'MENÚ - GACHA',
  'serbot': 'MENÚ - SUB BOTS',
  'rpg': 'MENÚ - RPG',
  'rg': 'MENÚ - REGISTRO',
  'xp': 'MENÚ - EXP',
  'sticker': 'MENÚ - STICKERS',
  'anime': 'MENÚ - ANIMES',
  'database': 'MENÚ - DATABASE',
  'fix': 'MENÚ - FIXMSGESPERA',
  'grupo': 'MENÚ - GRUPOS',
  'nable': 'MENÚ - ON/OFF', 
  'descargas': 'MENÚ - DESCARGAS',
  'tools': 'MENÚ - HERRAMIENTAS',
  'info': 'MENÚ - INFORMACIÓN',
  'nsfw': 'MENÚ - NSFW', 
  'owner': 'MENÚ - OWNER', 
  'audio': 'MENÚ - AUDIOS', 
  'ai': 'MENÚ - AI',
  'transformador': 'MENÚ - CONVERTIDORES',
}

const defaultMenu = {
  before: `© Menu completo de YotsubaBot-MD 🍀

  *Unete a nuestro Servidor de Minecraft LANCELOTCRAFT*
  https://discord.gg/lancelotgames
  *LANCELOTGames Te espera ❤️*

*•/• Info usuario •/•*
🌸 Cliente » %name
✨️ Exp » %exp
🍪 YotsubaCoins » %cookies
🛡 Nivel » %level
💫 Rango » %role

*•/• Info del bot •/•*
🍁 Made by » @Alba070503
🚩 Bot » %botofc
📆 Fecha » %fecha
🕖 Actividad » %muptime
👤 Usuarios » %totalreg

\t*L I S T A  -  D E  -  C O M A N D O S* 
`.trimStart(),
  header: '*•/• %category •/•*\n',
  body: '✰ %cmd',
  footer: '',
  after: `> ${dev}`,
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, cookies, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })
    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        premium: plugin.premium,
      }
    })

    for (let plugin of help) {
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    }

    conn.menu = conn.menu || {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')

    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%', p: _p, uptime: muptime,
      botofc: (conn.user.jid == global.conn.user.jid ? 'Oficial' : 'SubBot'), 
      fecha: date, totalreg, name, exp: exp - min, maxexp: xp, cookies, level, role,
    }
    
    text = text.replace(new RegExp(`%(${Object.keys(replace).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let category = "video"
    const db = './src/database/db.json'
    const db_ = JSON.parse(await promises.readFile(db, 'utf-8'))
    const random = Math.floor(Math.random() * db_.links[category].length)
    global.vid = db_.links[category][random]
    const response = await fetch(vid)
    const gif = await response.buffer()

    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/AdwJ.jpg')

    await conn.sendMessage(m.chat, {
      video: { url: vid }, caption: text.trim(),
      gifPlayback: true, gifAttribution: 0 
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, '「✘」 *Ocurrió un error al enviar el menú*', m)
    throw e
  }
}

handler.help = ['allmenu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menucompleto']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
          }
