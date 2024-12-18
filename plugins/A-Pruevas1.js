const owners = global.owner || []; // Lista de owners del bot
const channelId = "120363360977692179@newsletter"; // ID del canal de WhatsApp
const defaultThumbnail = 'https://qu.ax/QGAVS.jpg'; // Imagen predeterminada si no hay foto de perfil

let handler = async (m, { conn }) => {
  try {
    let user = m.participant || m.key.participant || m.key.remoteJid; // Usuario que realizó la acción
    let userNumber = user ? user.replace(/[^0-9]/g, '') : 'Desconocido'; // Número del usuario
    let chatName = m.chat || 'Desconocido'; // Nombre del chat o grupo
    let pp = await conn.profilePictureUrl(user, 'image').catch(() => defaultThumbnail); // Foto de perfil del usuario

    // Aviso de Mensaje Eliminado
    if (m.messageStubType === 68) { // StubType para mensajes eliminados
      let deletedMessage = `🚨 *Mensaje Eliminado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chatName}\n🔸 Un mensaje fue eliminado.`;

      await sendNotification(conn, channelId, owners, deletedMessage, pp, '🚨 Aviso de Mensaje Eliminado', 'Un mensaje ha sido eliminado');
    }

    // Aviso de Mensaje Editado
    if (m.message?.protocolMessage?.type === 1) { // ProtocolMessage para mensajes editados
      let editedMessage = `🚨 *Mensaje Editado*\n\n🔹 *Usuario:* wa.me/${userNumber}\n🔹 *Chat:* ${chatName}\n🔸 Un mensaje ha sido editado.`;

      await sendNotification(conn, channelId, owners, editedMessage, pp, '🚨 Aviso de Mensaje Editado', 'Un mensaje ha sido editado');
    }
  } catch (e) {
    console.error(e);
  }
};

// Función para enviar notificaciones
async function sendNotification(conn, channelId, owners, message, thumbnail, title, body) {
  try {
    // Intentar enviar el mensaje al canal
    let sentToChannel = false;
    if (channelId) {
      await conn.sendMessage(channelId, {
        text: message,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: body,
            thumbnailUrl: thumbnail,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      });
      sentToChannel = true;
    }

    // Si no se envió al canal, enviar a los owners
    if (!sentToChannel) {
      for (let owner of owners) {
        await conn.sendMessage(owner + '@s.whatsapp.net', {
          text: message,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: body,
              thumbnailUrl: thumbnail,
              sourceUrl: null,
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        });
      }
    }
  } catch (e) {
    console.error('Error al enviar notificación:', e);
  }
}

// Exportar el handler para que funcione como plugin
handler.command = []; // No es un comando directo
handler.register = true; // Se ejecuta automáticamente
export default handler;
