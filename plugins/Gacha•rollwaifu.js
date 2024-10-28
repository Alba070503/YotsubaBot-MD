/*
《✧》DERECHOS RESERVADOS DEL AUTOR 《✧》
- DavidChian (@David-Chian)
*/

import fs from 'fs';
import { v4 as uuid } from 'uuid';

const completadoImage = './src/completado.jpg';

const obtenerDatos = () => {
    try {
        return fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
    } catch (error) {
        console.error('✧ Error al leer data.json:', error);
        return { 'usuarios': {}, 'personajesReservados': [] };
    }
};

const guardarDatos = (data) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('✧ Error al escribir en data.json:', error);
    }
};

const reservarPersonaje = (userId, personaje) => {
    let data = obtenerDatos();
    data.personajesReservados.push({ 'userId': userId, ...personaje });
    guardarDatos(data);
};

const obtenerPersonajes = () => {
    try {
        return JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8'));
    } catch (error) {
        console.error('✧ Error al leer characters.json:', error);
        return [];
    }
};

let cooldowns = {};

const handler = async (m, { conn }) => {
    try {
        let userId = m.sender;
        let currentTime = new Date().getTime();
        let cooldownTime = 10 * 60 * 1000;
        let lastUsed = cooldowns[userId] || 0;
        let timePassed = currentTime - lastUsed;

        if (timePassed < cooldownTime) {
            let remainingTime = cooldownTime - timePassed;
            let minutes = Math.floor(remainingTime / (1000 * 60));
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            let cooldownMessage = `《✧》Debes esperar *${minutes} minutos ${seconds} segundos* para usar *#rw* de nuevo.`;
            await conn.sendMessage(m.chat, { 'text': cooldownMessage });
            return;
        }

        const validarBot = () => {
            try {
                const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
                if (pkg.name !== 'YotsubaBot-MD') return false;
                if (pkg.repository.url !== 'git+https://github.com/Alba070503/YotsubaBot-MD.git') return false;
                return true;
            } catch (error) {
                console.error('✧ Error al leer package.json:', error);
                return false;
            }
        };

        if (!validarBot()) {
            await conn.sendMessage(m.chat, '✧ Este comando solo es disponible en YaemoriBot-MD\n◇ https://github.com/Alba070503/YotsubaBot-MD', m, rcanal);
            return;
        }

        let data = obtenerDatos();
        let personajes = obtenerPersonajes();
        let personajeDisponible = personajes.find(personaje => {
            return !Object.values(data.usuarios).some(usuario => usuario.personajes.includes(personaje.url));
        });

        if (!personajeDisponible) {
            await conn.sendMessage(m.chat, { 'image': { 'url': completadoImage }, 'caption': '《✧》Felicidades, todos los personajes han sido obtenidos. ¡Pronto habrá mas waifus para recolectar!' });
            return;
        }

        const personajeSeleccionado = personajeDisponible;
        const personajeId = uuid();
        let reservado = data.personajesReservados.some(p => p.url === personajeSeleccionado.url);
        let ocupadoPor = Object.entries(data.usuarios).find(([id, usuario]) => usuario.personajes.includes(personajeSeleccionado.url));

        let estadoPersonaje = ocupadoPor ? `Estado: Ocupado por ${ocupadoPor[1].name}` : 'Estado: Libre';
        const mensaje = `┏━━━━━━━━━⪩\n┃˚₊ · ͟͟͞͞➳❥ 𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒\n┃⏤͟͟͞͞𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐉𝐄 𝐎𝐁𝐓𝐔𝐕𝐈𝐃𝐎\n┗━━━━━━━━━⪩\n\n✰ Nombre:\n> » *${personajeSeleccionado.name}*\n\n✰ Valor:\n> » *${personajeSeleccionado.value}* WFCoins!\n✰ Estado:\n> » ${estadoPersonaje}\n\n*✰ Identificacion:*\n<id:${personajeId}>`;

        await conn.sendMessage(m.chat, {
            'image': { 'url': personajeSeleccionado.url },
            'caption': mensaje,
            'mimetype': 'image/jpeg',
            'contextInfo': {
                'mentionedJid': ocupadoPor ? [ocupadoPor[0]] : [],
                'externalAdReply': {
                    'showAdAttribution': true,
                    'title': '¡Nuevo personaje!',
                    'body': dev,
                    'thumbnailUrl': personajeSeleccionado.url,
                    'sourceUrl': redes,
                    'previewType': 'PHOTO',
                    'mediaType': 1,
                    'renderLargerThumbnail': false
                }
            }
        });

        if (!ocupadoPor) {
            reservarPersonaje(userId, { ...personajeSeleccionado, 'id': personajeId });
        }
        cooldowns[userId] = currentTime;
    } catch (error) {
        console.error('Error:', error);
        await conn.sendMessage(m.chat, { 'text': '《✧》Ocurrió un error al procesar tu solicitud. Intenta de nuevo mas tarde. ' + error });
    }
};

handler.help = ['rw'];
handler.tags = ['gacha'];
handler.command = ['roll', 'rw'];
handler.register = true;

export default handler;
