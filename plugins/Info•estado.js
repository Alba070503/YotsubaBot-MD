let handler = async (m, { conn }) => {
  // Definir imagen por defecto
  let pp = 'https://qu.ax/ilnry.jpg'; // URL de imagen de ejemplo

  // Variables de sistema
  let totalreg = Object.keys(global.db.data.users).length;
  let totalchats = Object.keys(global.db.data.chats).length;

  let _muptime;
  if (process.send) {
    process.send('uptime');
    _muptime = await new Promise((resolve) => {
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    });
  }
  let muptime = clockString(_muptime * 1000 || 0);

  // Obtener información de chats
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));

  // Mensaje final
  let estado = `╭─⬣「 *Estado De Yotsuba Nakano* 」⬣
│ 🚩 *Creador ∙* Alba070503
│ 📚 *Grupos Unidos ∙* ${groupsIn.length}
│ 👤 *Chats Privados ∙* ${chats.length - groupsIn.length}
│ 💬 *Total De Chats ∙* ${chats.length}
│ 🍁 *Usuarios Registrados ∙* ${totalreg}
│ 🕜 *Actividad ∙* ${muptime}
╰─⬣`;

  // Enviar mensaje con imagen
  await conn.sendFile(m.chat, pp, 'estado.jpg', estado, m);
};

handler.help = ['status'];
handler.tags = ['info'];
handler.command = ['estado', 'status', 'stats', 'estate', 'state'];
handler.register = true;

export default handler;

// Función para formatear tiempo en hh:mm:ss
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
