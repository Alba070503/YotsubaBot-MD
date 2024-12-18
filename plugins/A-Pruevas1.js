let handler = m => m;

handler.all = async function (m, { conn }) {
  const staffGroupID = '120363347714830215@g.us'; // ID del grupo del staff
  const channelID = '120363198641161536@newsletter'; // ID del canal de WhatsApp

  // Variables del evento
  const user = m.participant || m.key.remoteJid;
  const chat = m.key.remoteJid;
  const userNumber = user.split('@')[0];

  // Detectar mensaje borrado
  if (m.message && m.messageStubType === 68) { // 68 = Mensaje eliminado
    const notification = `🚨 *Mensaje Eliminado* 🚨\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chat}\n\n⚠️ *Un usuario eliminó un mensaje.*`;

    // Enviar al grupo del staff o al canal
    try {
      await conn.sendMessage(staffGroupID, { text: notification });
    } catch (e) {
      await conn.sendMessage(channelID, { text: notification });
    }
  }

  // Detectar mensaje editado
  if (m.message && m.messageStubType === 69) { // 69 = Mensaje editado
    const notification = `📝 *Mensaje Editado* 📝\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chat}\n\n⚠️ *Un usuario editó un mensaje.*`;

    // Enviar al grupo del staff o al canal
    try {
      await conn.sendMessage(staffGroupID, { text: notification });
    } catch (e) {
      await conn.sendMessage(channelID, { text: notification });
    }
  }
};

export default handler;
