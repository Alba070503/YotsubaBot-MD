const staffGroupID = '120363347714830215@g.us'; // ID del grupo del staff
const channelID = '120363360977692179@newsletter'; // ID del canal oficial

let handler = async (m, { conn }) => {
  try {
    let user = m.participant || m.key.participant || m.key.remoteJid; // Usuario involucrado
    let userNumber = user ? user.replace(/[^0-9]/g, '') : 'Desconocido';
    let chatName = m.chat || 'Desconocido';

    // Foto de perfil del usuario
    let pp = await conn.profilePictureUrl(user, 'image').catch(() => 'https://qu.ax/QGAVS.jpg');

    // Mensaje Eliminado
    if (m.messageStubType === 68) { // StubType 68 es para mensajes eliminados
      let deletedMessage = `🚨 *Mensaje Eliminado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chatName}\n\n🔸 Un mensaje fue eliminado.`;

      let options = {
        contextInfo: {
          externalAdReply: {
            title: '🚨 Aviso de Mensaje Eliminado',
            body: 'Un mensaje ha sido eliminado en el canal',
            thumbnailUrl: pp,
            sourceUrl: `https://wa.me/${userNumber}`,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      };

      // Enviar aviso al grupo del staff o canal
      await conn.sendMessage(staffGroupID, { text: deletedMessage, contextInfo: options.contextInfo }).catch(async () => {
        await conn.sendMessage(channelID, { text: deletedMessage, contextInfo: options.contextInfo });
      });
    }

    // Mensaje Editado
    if (m.message?.protocolMessage?.type === 1) { // ProtocolMessage Type 1 es para mensajes editados
      let editedMessage = `🚨 *Mensaje Editado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chatName}\n\n🔸 Un mensaje ha sido editado.`;

      let options = {
        contextInfo: {
          externalAdReply: {
            title: '🚨 Aviso de Mensaje Editado',
            body: 'Un mensaje ha sido editado en el canal',
            thumbnailUrl: pp,
            sourceUrl: `https://wa.me/${userNumber}`,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      };

      // Enviar aviso al grupo del staff o canal
      await conn.sendMessage(staffGroupID, { text: editedMessage, contextInfo: options.contextInfo }).catch(async () => {
        await conn.sendMessage(channelID, { text: editedMessage, contextInfo: options.contextInfo });
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export default handler;
