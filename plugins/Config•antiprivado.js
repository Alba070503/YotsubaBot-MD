export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  try {
    // Ignorar mensajes propios del bot y mensajes sin contenido
    if (m.isBaileys && m.fromMe) return true;
    if (!m.message) return true;

    // Ignorar mensajes en grupos y canales
    if (m.isGroup || m.chat.endsWith('@broadcast')) return false;

    // Excluir ciertos textos específicos
    const excludedTexts = ['PIEDRA', 'PAPEL', 'TIJERA', 'serbot', 'jadibot'];
    if (excludedTexts.some((text) => m.text?.includes(text))) return true;

    // Obtener datos del chat y configuración del bot
    const chat = global.db.data.chats[m.chat] || {};
    const bot = global.db.data.settings[this.user.jid] || {};

    // Verificar si el antiPrivate está activado y el usuario no es propietario
    if (bot.antiPrivate && !isOwner && !isROwner) {
      const grupo = 'https://whatsapp.com/channel/0029VaAN15BJP21BYCJ3tH04'; // Reemplaza con el enlace real

      // Enviar advertencia al usuario
      await m.reply(
        `❀ Hola @${m.sender.split`@`[0]}, mi creador ha desactivado los comandos en chats privados.\n` +
        `Serás bloqueado automáticamente. Si quieres usar los comandos, únete al grupo principal del bot:\n\n${grupo}`,
        null,
        { mentions: [m.sender] }
      );

      // Bloquear al usuario
      await this.updateBlockStatus(m.sender, 'block');
    }
    return false;
  } catch (error) {
    console.error('Error en el handler before:', error);
    return true;
  }
}
