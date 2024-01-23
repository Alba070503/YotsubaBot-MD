import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'

global.owner = [['51991241360', 'Stef_Yuly', true], ['51991241360', 'Kumiko-MD💙', true], ['51991241360'], ['51991241360'], ['51991241360'], ['51991241360'], ['51991241360'], ['51991241360'], ['51991241360'], ['51991241360'], ['51910877277']]

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumberCode = '' //Ejemplo: +59309090909
global.confirmCode = ''

global.animxscans = ['51991241360']
global.suittag = ['51991241360']
global.mods = []
global.suittag = ['51991241360'];
global.prems = ['51991241360'];

global.packname = 'Kumiko MD'
global.author = 'Kumiko MD'
global.wm = '© Kumiko-MD'
global.wm2 = 'Kumiko : 𝗕𝗈𝗍'
global.azami = 'Stef_Yuly'
global.cb = 'Kumiko-MD'

global.vs = '1.0.2'
global.library = 'Baileys'
global.baileys = '@whiskeysockets/baileys'
global.lenguaje = 'Español'
global.menudi = ['⛶','❏','⫹⫺']
global.dev = '51991241360'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => { unwatchFile(file)
console.log(chalk.yellow('Se actualizo el archivo config.js'))
import(`${file}?update=${Date.now()}`)
})
