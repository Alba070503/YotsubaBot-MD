import fs from 'fs';

// Variables globales
let cooldowns = {};
const dataPath = './data.json';

// Funciones auxiliares
const obtenerDatos = () => {
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
  return { usuarios: {}, personajesReservados: [] };
};

const guardarDatos = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Función principal del comando
const handler = async (message, { conn }) => {
  const userId = message.sender;
  const chatId = message.chat;
  const mentionedUser = message.mentionedJid[0];
  const datos = obtenerDatos();

  if (!mentionedUser) {
    await conn.reply(chatId, '《✧》Debes mencionar a un usuario para reclamar su personaje.', message);
    return;
  }

  const personajeReservado = datos.personajesReservados.find(p => p.id === mentionedUser);

  if (!personajeReservado) {
    await conn.reply(chatId, '《✧》El personaje no está disponible para ser reclamado.', message);
    return;
  }

  const currentTime = Date.now();
  const cooldownTime = 10 * 60 * 1000; // 10 minutos

  if (cooldowns[userId] && currentTime - cooldowns[userId] < cooldownTime) {
    const remainingTime = cooldownTime - (currentTime - cooldowns[userId]);
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    await conn.reply(chatId, `《✧》Debes esperar ${minutes} minutos y ${seconds} segundos antes de reclamar otro personaje.`, message);
    return;
  }

  // Reclamar el personaje
  if (!datos.usuarios[userId]) {
    datos.usuarios[userId] = { characters: [], characterCount: 0 };
  }

  const usuarioActual = datos.usuarios[userId];
  usuarioActual.characters.push({
    name: personajeReservado.name,
    url: personajeReservado.url,
    value: personajeReservado.value,
  });
  usuarioActual.characterCount += 1;

  // Actualizar la lista de personajes reservados
  datos.personajesReservados = datos.personajesReservados.filter(p => p.id !== mentionedUser);

  guardarDatos(datos);
  cooldowns[userId] = currentTime;

  await conn.reply(
    chatId,
    `《✧》¡Felicidades @${userId.split('@')[0]}! Has reclamado a *${personajeReservado.name}*.`,
    message,
    { mentions: [userId] }
  );
};

// Configuración del comando
handler.command = ['c'];
handler.help = ['reclamar'];
handler.tags = ['gacha'];
handler.group = false;

export default handler;
