// plugins/__jadibot-delete.js
import { existsSync, promises as fs } from "fs";
import { join } from "path";

const sessionsPath = join(process.cwd(), "sessions");

let handler = async (m, { conn }) => {
    let userId = m.sender.split("@")[0];
    const userSessionPath = join(sessionsPath, userId);

    try {
        if (existsSync(userSessionPath)) {
            await fs.rm(userSessionPath, { recursive: true, force: true });
            conn.sendMessage(m.chat, { text: '✦ Sub-Bot eliminado exitosamente.' }, { quoted: m });
        } else {
            conn.sendMessage(m.chat, { text: 'No tienes una sesión activa de Sub-Bot.' }, { quoted: m });
        }
    } catch (err) {
        console.error(err);
        conn.sendMessage(m.chat, { text: 'Error al eliminar la sesión de Sub-Bot.' }, { quoted: m });
    }
};

handler.help = ['delsession'];
handler.tags = ['jadibot'];
handler.command = /^(deletesession|eliminarsesion|borrarsesion|delsession|cerrarsesion|delserbot|logout)$/i;

export default handler;
