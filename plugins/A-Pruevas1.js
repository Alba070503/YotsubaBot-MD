const staffGroupID = '120363347714830215@g.us'; // ID del grupo del staff
const channelID = '120363198641161536@newsletter'; // ID del canal oficial

let handler = async (m, { conn }) => {
  let user = m.participant || m.key.participant || m.key.remoteJid; // Usuario que realizó la acción
  let userNumber = user ? user.replace(/[^0-9]/g, '') : 'Desconocido';

  let pp = await conn.profilePictureUrl(user, 'image').catch(() => 'https://qu.ax/QGAVS.jpg');

  // Aviso si el mensaje fue eliminado
  if (m.message?.protocolMessage?.type === 0 || m.messageStubType === 68) { 
    let deletedMsg = `🚨 *Mensaje Eliminado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${m.chat}\n\n🔸 Un mensaje fue eliminado.`;

    let options = {
      contextInfo: {
        externalAdReply: {
          title: '🚨 Aviso de Eliminación',
          body: 'Se eliminó un mensaje en el canal',
          thumbnailUrl: pp,
          sourceUrl: 'https://wa.me/' + userNumber,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };

    try {
      await conn.sendMessage(staffGroupID, { text: deletedMsg, contextInfo: options.contextInfo });
    } catch (e) {
      await conn.sendMessage(channelID, { text: deletedMsg, contextInfo: options.contextInfo });
    }
  }

  // Aviso si el mensaje fue editado
  if (m.message?.protocolMessage?.type === 1) { 
    let editedMsg = `🚨 *Mensaje Editado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${m.chat}\n\n🔸 Un mensaje fue editado.`;

    let options = {
      contextInfo: {
        externalAdReply: {
          title: '🚨 Aviso de Edición',
          body: 'Se editó un mensaje en el canal',
          thumbnailUrl: pp,
          sourceUrl: 'https://wa.me/' + userNumber,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };

    try {
      await conn.sendMessage(staffGroupID, { text: editedMsg, contextInfo: options.contextInfo });
    } catch (e) {
      await conn.sendMessage(channelID, { text: editedMsg, contextInfo: options.contextInfo });
    }
  }
};

export default handler;
