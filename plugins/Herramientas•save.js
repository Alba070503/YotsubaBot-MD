import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {

    if (!text) throw `*🚩 Ingrese el nombre del plugin*`
    if (!m.quoted.text) throw `*🚩 Responde al mensaje*`
    let ruta = `plugins/${text}.js`
    await fs.writeFileSync(ruta, m.quoted.text)
    m.reply(`*✨️ Guardado en ${ruta}*`)
}
handler.help = ['saveplugin'].map(v => v + ' nombre')
handler.tags = ['owner']
handler.command = ["save", "saveplugin"]
handler.owner = true
handler.owner = true

export default handler