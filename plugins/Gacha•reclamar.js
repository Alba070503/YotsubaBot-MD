/*
《✧》DERECHOS RESERVADOS POR EL AUTOR 《✧》
- DavidChian (@David-Chian)
*/

import fs from 'fs';

let cooldowns = {};

const obtenerDatos = () => {
  return fs.existsSync('./data.json') ? JSON.parse(fs.readFileSync('./data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
};

const guardarDatos = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

const verificarBot = () => {
  try {
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    if (packageData.name !== 'YaemoriBot-MD') return false;
    if (packageData.repository.url !== 'git+https://github.com/Dev-Diego/YaemoriBot-MD.git') return false;
    return true;
  } catch (error) {
    console.error('✧ Error al leer package.json:', error);
    return false;
  }
};

let handler = async (message, { conn }) => {
  if (!message.quoted) return;

  if (!verificarBot()) {
    await conn.sendMessage(message.chat, '✧ Este comando solo es disponible en YotsubaBot-MD\n◇ https://github.com/Alba070503/YotsubaBot-MD', message, 'rcanal');
    return;
  }

  let senderId = message.sender;
  let senderName = await conn.getName(senderId);
  let characterId = message.quoted.text.match(/<id:(.*)>/)?.[1];
  let data = obtenerDatos();

  if (!characterId) return;

  let reservedCharacter = data.personajesReservados.find((c) => c.id === characterId);
  let currentTime = new Date().getTime();
  let cooldownTime = 10 * 60 * 1000;
  let lastUsed = cooldowns[senderId] || 0;

  if (currentTime - lastUsed < cooldownTime) {
    let remainingTime = cooldownTime - (currentTime - lastUsed);
    let minutes = Math.floor(remainingTime / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);
    await conn.reply(message.chat, `《✧》Debes esperar *${minutes} minutos ${seconds} segundos* para usar *#c* de nuevo.`, message);
    return;
  }

  if (!reservedCharacter) {
    conn.sendMessage(message.chat, '《✧》Lo siento, el personaje no está disponible por el momento.', message, { mentions: [senderId] });
    return;
  }

  let isCharacterClaimed = data.usuarios[reservedCharacter.userId]?.characters?.some((c) => c.url === reservedCharacter.url);

  if (isCharacterClaimed) {
    conn.sendMessage(message.chat, `《✧》El personaje ${reservedCharacter.name} ya es de otro usuario y no puedes robarlo.\nPrueba suerte con el comando #robarp`, message, { mentions: [senderId] });
    cooldowns[senderId] = currentTime;
    return;
  }

  if (reservedCharacter.userId !== senderId) {
    setTimeout(async () => {
      let isSuccessful = Math.random() < 0.5;

      if (isSuccessful) {
        if (!data.usuarios[senderId]) data.usuarios[senderId] = { characters: [], characterCount: 0, totalRwcoins: 0 };

        data.usuarios[senderId].characters.push({ name: reservedCharacter.name, url: reservedCharacter.url, value: reservedCharacter.value });
        
        if (data.usuarios[reservedCharacter.userId]) {
          data.usuarios[reservedCharacter.userId].characters = data.usuarios[reservedCharacter.userId].characters.filter((c) => c.url !== reservedCharacter.url);
        }

        data.personajesReservados = data.personajesReservados.filter((c) => c.id !== characterId);
        guardarDatos(data);

        let originalUserId = reservedCharacter.userId;
        let originalUserName = await conn.getName(originalUserId);

        await conn.sendMessage(
          message.chat,
          `✰ *${senderName.split('@')[0]}, has robado a ${reservedCharacter.name} de @${originalUserName.split('@')[0]}!*`,
          message,
          { mentions: [senderId, originalUserId] }
        );
      } else {
        let originalUserId = reservedCharacter.userId;
        let originalUserName = await conn.getName(originalUserId);

        await conn.sendMessage(
          message.chat,
          `《✧》No has podido robar el personaje ${reservedCharacter.name} de @${originalUserName.split('@')[0]}!`,
          message,
          { mentions: [senderId, originalUserId] }
        );
      }

      cooldowns[senderId] = currentTime;
    });
    return;
  }

  if (!data.usuarios[senderId]) data.usuarios[senderId] = { characters: [], characterCount: 0, totalRwcoins: 0 };

  let userCharacters = data.usuarios[senderId].characters;
  let alreadyOwned = userCharacters.some((c) => c.url === reservedCharacter.url);

  if (alreadyOwned) {
    conn.sendMessage(message.chat, `《✧》Ya tienes el personaje ${reservedCharacter.name}!`, message, { mentions: [senderId] });
    return;
  }

  userCharacters.push({ name: reservedCharacter.name, url: reservedCharacter.url, value: reservedCharacter.value });
  data.usuarios[senderId].characterCount++;
  data.usuarios[senderId].totalRwcoins += reservedCharacter.value;
  data.personajesReservados = data.personajesReservados.filter((c) => c.id !== characterId);
  guardarDatos(data);

  conn.sendMessage(message.chat, `《✧》 Felicidades @${senderName.split('@')[0]}!`, message, { mentions: [senderId] });
  cooldowns[senderId] = currentTime;
};

handler.command = ['c'];
handler.tags = ['gacha'];
handler.help = ['c', 'confirmar'];
handler.register = true;

export default handler;
