/*
《✧》DERECHOS RESERVADOS POR EL AUTOR 《✧》
- DavidChian (@David-Chian)
*/

import fs from 'fs';

// Función para obtener los datos del archivo data.json
const obtenerDatos = () => {
    if (fs.existsSync('data.json')) {
        return JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    } else {
        return { 'usuarios': {}, 'personajesReservados': [] };
    }
};

// Función para obtener personajes del archivo characters.json
const obtenerPersonajes = () => {
    if (fs.existsSync('./src/JSON/characters.json')) {
        return JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8'));
    } else {
        return [];
    }
};

// Función principal del handler
let handler = async (m, { conn, text }) => {
    if (!text) {
        conn.reply(m.chat, '《✧》Por favor, proporciona el nombre del personaje que deseas ver.\n> ✎ Ejemplo: #character Yaemori', m);
        return;
    }

    // Validación de la autenticidad del bot
    const validarBot = () => {
        try {
            const data = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
            if (data.name !== 'YotsubaBot-MD') return false;
            if (data.repository.url !== 'git+https://github.com/Alba070503/YotsubaBot-MD.git') return false;
            return true;
        } catch (error) {
            console.error('✧ Error al leer package.json:', error);
            return false;
        }
    };

    // Si el bot no es YaemoriBot-MD, devuelve mensaje de error
    if (!validarBot()) {
        await conn.sendMessage(m.chat, '✧ Este comando solo es disponible en YotsubaBot-MD\n◇ https://github.com/Alba070503/YotsubaBot-MD', m);
        return;
    }

    const userId = m.sender;
    const characterName = text.trim().toLowerCase();
    const data = obtenerDatos();
    const personajes = obtenerPersonajes();

    // Verifica si el usuario tiene el personaje
    if (!data.usuarios[userId] || !data.usuarios[userId].personajes.some(personaje => personaje.name.toLowerCase() === characterName)) {
        conn.reply(m.chat, `《✧》No tienes el personaje ${characterName} en tu inventario.`, m);
        return;
    }

    const personaje = data.usuarios[userId].personajes.find(p => p.name.toLowerCase() === characterName);
    if (!personaje) {
        conn.reply(m.chat, `《✧》No se encontró información para el personaje ${characterName}.`, m);
        return;
    }

    const mensaje = `《✧》Este es tu personaje.\n *${personaje.name}*\nSu valor es: ${personaje.value} RwCoins.`;
    await conn.sendMessage(m.chat, {
        image: { url: personaje.url },
        caption: mensaje,
        mimetype: 'image/jpeg'
    });
};

// Configuración del handler
handler.help = ['character'];
handler.tags = ['gacha'];
handler.command = ['character'];
handler.register = true;

export default handler;
