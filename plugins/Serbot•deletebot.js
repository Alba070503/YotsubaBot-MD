import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fs } from "fs";
import path, { join } from 'path';
import { areJidsSameUser, jidNormalizedUser } from '@adiwajshing/baileys';

let handler = async (m, { conn: parentw, usedPrefix, command }, args) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
    ? conn.user.jid 
    : m.sender;
    
  let uniqid = `${who.split`@`[0]}`;
  let userS = `${conn.getName(who)}`;
  let numerxd = jidNormalizedUser(who);

  try {
    const dirPath = `./sessions/${numerxd}`;

    // Verificar si el directorio existe antes de eliminar
    if (!existsSync(dirPath)) {
      await parentw.sendMessage(
        m.chat,
        { text: "No cuentas con ninguna sesión de Sub-Bot." },
        { quoted: m }
      );
      return;
    }

    // Eliminar el directorio
    await fs.rmdir(dirPath, { recursive: true, force: true });
    await parentw.sendMessage(
      m.chat,
      { text: '✦ Sub-Bot eliminado.' },
      { quoted: m }
    );
  } catch (err) {
    console.error(err); // Registrar el error para depuración
    await m.react('✖️');
  }
};

handler.tags = ['jadibot'];
handler.help = ['delsession'];
handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|cerrarsesion|delserbot|logout)$/i;

// handler.private = true;
handler.fail = null;

export default handler;
