let handler = m => m;

handler.all = async function (m, { conn }) {
  const staffGroupID = '120363347714830215@g.us'; // Grupo del staff
  const channelID = '120363198641161536@newsletter'; // Canal de respaldo

  // Si es un mensaje eliminado
  if (m.message && m.message.protocolMessage && m.message.protocolMessage.type === 0) {
    let user = m.participant || m.key.participant || m.key.remoteJid;
    let userNumber = user.replace(/[^0-9]/g, '');

    let notification = `🚨 *Mensaje Eliminado* 🚨\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${m.chat}\n\n⚠️ Un usuario eliminó un mensaje.`;

    // Enviar al grupo del staff o al canal
    try {
      await conn.sendMessage(staffGroupID, { text: notification });
    } catch (e) {
      await conn.sendMessage(channelID, { text: notification });
    }
  }
};

export default handler;
