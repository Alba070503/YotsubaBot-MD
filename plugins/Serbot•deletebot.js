import { promises as fs } from "fs";
import path from 'path';
import { jidNormalizedUser } from '@adiwajshing/baileys';

let handler = async (m, { conn: parentw, usedPrefix, command }, args) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
    ? conn.user.jid 
    : m.sender;
    
  let uniqid = `${who.split`@`[0]}`;
  let numerxd = jidNormalizedUser(who);
  let sessionPath = path.join("./sessions", numerxd);

  try {
    // Verificar y eliminar la sesión del objeto global `global.conn`
    if (global.conn && global.conn[`${numerxd}@s.whatsapp.net`]) {
      delete global.conn[`${numerxd}@s.whatsapp.net`];
    }

    // Verificar si el directorio de la sesión existe y eliminarlo
    if (await fs.stat(sessionPath).catch(() => false)) {
      await fs.rmdir(sessionPath, { recursive: true, force: true });
    } else {
      await parentw.sendMessage(
        m.chat,
        { text: "No cuentas con ninguna sesión de Sub-Bot activa." },
        { quoted: m }
      );
      return;
    }

    // Confirmar la eliminación
    await parentw.sendMessage(
      m.chat,
      { text: "✦ Sub-Bot eliminado correctamente." },
      { quoted: m }
    );
  } catch (err) {
    console.error("Error al eliminar la sesión:", err);
    await m.react('✖️');
    await parentw.sendMessage(
      m.chat,
      { text: "Ocurrió un error al intentar eliminar la sesión." },
      { quoted: m }
    );
  }
};

handler.tags = ['jadibot'];
handler.help = ['delsession'];
handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|cerrarsesion|delserbot|logout)$/i;

// handler.private = true;
handler.fail = null;

export default handler;
