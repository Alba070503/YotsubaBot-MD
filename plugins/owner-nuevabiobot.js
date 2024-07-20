let handler = async (m, { conn, text }) => {
   if (!text) return conn.reply(m.chat, '🤍 *¡Te faltó el texto mi propietario!*', m, rcanal)
     try {
                await conn.updateProfileStatus(text).catch(_ => _)
                conn.reply(m.chat, `✅️ Info Cambiada Con Exito!`, m, rcanal)
} catch {
       throw 'Well, Error Sis...'
     }
}
handler.help = ['setbotbio <teks>']
handler.tags = ['owner']
handler.command = /^setbiobot|nuevabiobot|setbotbio$/i
handler.owner = true

export default handler