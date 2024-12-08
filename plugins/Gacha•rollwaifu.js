import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de que esto esté correcto

const completadoImage = './src/completado.jpg';
const dev = 'Desarrollado por YotsubaBot';
const redes = 'https://github.com/Alba070503/YotsubaBot-MD';
const jsonURL = 'https://raw.githubusercontent.com/Alba070503/YotsubaBot-MD/refs/heads/main/src/JSON/characters.json';

const obtenerDatos = () => {
    try {
        return fs.existsSync('data.json') 
            ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) 
            : { usuarios: {}, personajesReservados: [] };
    } catch (error) {
        console.error('✿ Error al leer data.json:', error);
        return { usuarios: {}, personajesReservados: [] };
    }
};

const guardarDatos = (data) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('✿ Error al escribir en data.json:', error);
    }
};

const obtenerPersonajes = async () => {
    try {
        const response = await axios.get(jsonURL);
        return response.data;
    } catch (error) {
        console.error('✿ Error al obtener el JSON de personajes:', error);
        return [];
    }
};

let cooldowns = {};

const handler = async (m, { conn }) => {
    try {
        const sender = m.sender;
        const currentTime = new Date().getTime();
        const cooldownTime = 10 * 60 * 1000; // 10 minutos
        const lastUsed = cooldowns[sender] || 0;
        const timeDiff = currentTime - lastUsed;

        if (timeDiff < cooldownTime) {
            const remainingTime = cooldownTime - timeDiff;
            const minutes = Math.floor(remainingTime / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            const message = `《✿》Debes esperar *${minutes} minutos ${seconds} segundos* para usar *#rw* de nuevo.`;
            await conn.sendMessage(m.chat, { text: message });
            return;
        }

        let datos = obtenerDatos();
        let personajes = await obtenerPersonajes();

        const personajesDisponibles = personajes.filter((personaje) => {
            const personajeOcupado = Object.values(datos.usuarios).some((user) => user.characters.includes(personaje.url));
            return !personajeOcupado;
        });

        if (personajesDisponibles.length === 0) {
            await conn.sendMessage(m.chat, { 
                image: { url: completadoImage }, 
                caption: '《✿》Felicidades, todos los personajes han sido obtenidos. ¡Pronto habrá más waifus para recolectar!' 
            });
            return;
        }

        const personajeAleatorio = personajesDisponibles[Math.floor(Math.random() * personajesDisponibles.length)];
        const personajeId = uuidv4();

        let propietario = Object.entries(datos.usuarios).find(([, user]) => user.characters.includes(personajeAleatorio.url));
        const estado = propietario ? `Estado: Ocupado por ${propietario[0]}` : 'Estado: Libre';

        const caption = `•・。.・゜✭・.・✫・゜・。.\n│ ❀ Felicidades\n│✿ Por el Nuevo Personaje\n꒷︶꒷꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒷꒥꒷\n\n✰ Nombre:\n> » ${personajeAleatorio.name}\n✰ Valor:\n> » ${personajeAleatorio.value} *YotsuCoins☘️*!\n✰ Estado:\n> » ${estado}\n\n*✰ Identificacion:*\n<id:${personajeId}>`;

        await conn.sendMessage(m.chat, { 
            image: { url: personajeAleatorio.url }, 
            caption, 
            mimetype: 'image/jpeg', 
            contextInfo: {
                mentionedJid: propietario ? [propietario[0]] : [],
                externalAdReply: {
                    showAdAttribution: true,
                    title: '¡Nuevo personaje!',
                    body: dev,
                    thumbnailUrl: personajeAleatorio.url,
                    sourceUrl: redes,
                    previewType: 'PHOTO',
                    mediaType: 1,
                    renderLargerThumbnail: false,
                },
            },
        });

        if (!propietario) {
            if (!datos.usuarios[sender]) datos.usuarios[sender] = { characters: [] };
            datos.usuarios[sender].characters.push(personajeAleatorio.url);
            guardarDatos(datos);
        }

        cooldowns[sender] = currentTime;

    } catch (error) {
        console.error('《✿》Ocurrió un error:', error);
        await conn.sendMessage(m.chat, { text: `《✿》Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.\n${error}` });
    }
};

handler.help = ['rw'];
handler.tags = ['gacha'];
handler.command = ['roll', 'rw'];
handler.limit = true;

export default handler;
