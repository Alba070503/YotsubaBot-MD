/*let handler = async (m, { conn }) => {
  try {
  m.reply('Hola bebé ✨️❤️')
  } catch (e) {
    console.error('Error al enviar hola', e);
  }}

handler.command = ['hola', 'hello']
export default handler;*/

module.exports = {
    name: 'kick',
    description: 'Expulsa a un miembro del grupo',
    aliases: ['remove', 'hakai', 'largate'],
    async execute(sock, m, args, isBotAdmin) {
        if (!m.isGroup) return

        const groupInfo = await sock.groupMetadata(m.chat), isAdmin = groupInfo?.participants.some(p => p.id == m.sender && ['admin', 'superadmin'].includes(p.admin))
        if (!isAdmin) return sock.sendMessage(m.chat, { text: 'Solo administradores.' }, { quoted: m })

        const targetUser = args.length ? args[0].replace('@', '').replace(/\s/g, '').split('@')[0] + '@s.whatsapp.net' : m.quoted?.sender
        if (!targetUser) return sock.sendMessage(m.chat, { text: '*kick <@usuario>*' }, { quoted: m })

        const userObj = groupInfo.participants.find(p => p.id === targetUser)
        if (!userObj) return sock.sendMessage(m.chat, { text: '¿?' }, { quoted: m })
        if (['admin', 'superadmin'].includes(userObj.admin)) return sock.sendMessage(m.chat, { text: 'No puedo eliminar a un administrador.' }, { quoted: m })

        await sock.groupParticipantsUpdate(m.chat, [targetUser], 'remove')
        sock.sendMessage(m.chat, {
            contextInfo: { remoteJid: m.chat, mentionedJid: [m.sender, targetUser] },
            video: { url: 'https://telegra.ph/file/25ec490a6f4dd4b423110.mp4' },
            gifPlayback: true,
            caption: `ㅤ *⋯⋯ REMOVE ⋯⋯*
 ∘ *Grupo:* ${groupInfo.subject}
 ∘ *Usuario removido:* @${targetUser.split('@')[0]}
 ∘ *Por:* @${m.sender.split('@')[0]}

*©ᴢɪᴏᴏᴏ*`,
        })
    },
}
