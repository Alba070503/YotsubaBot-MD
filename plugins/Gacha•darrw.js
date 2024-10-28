/*
《✧》DERECHOS RESERVADOS POR EL AUTOR 《✧》
- DavidChian (@David-Chian)
*/

import fs from 'fs';

const obtenerDatos = () => {
    return fs.existsSync('data.json')
        ? JSON.parse(fs.readFileSync('data.json', 'utf-8'))
        : { 'usuarios': {}, 'personajesReservados': [] };
};

const guardarDatos = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

const obtenerPersonajes = () => {
    if (fs.existsSync('./src/JSON/characters.json')) {
        return JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8'));
    } else {
        throw new Error('✧ No se encontró el archivo de personajes.');
    }
};

let handler = async (message, { conn, args }) => {
    if (args.length < 2) {
        conn.reply(message.chat, '《✧》Debes mencionar a un usuario y el nombre del personaje.\n> ✎ Ejemplo: #darrw @user Yaemori', message);
        return;
    }

    const verificarBot = () => {
        try {
            const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
            if (packageData.name !== 'YaemoriBot-MD') return false;
            if (packageData.repository.url !== 'git+https://github.com/Alba070503/YotsubaBot-MD.git') return false;
            return true;
        } catch (error) {
            console.error('✧ Error al leer package.json:', error);
            return false;
        }
    };

    if (!verificarBot()) {
        await conn.sendMessage(message.chat, '✧ Este comando solo es disponible en YotsubaBot-MD\n◇ https://github.com/Alba070503/YotsubaBot-MD', message);
        return;
    }

    let targetUser = message.mentionedJid[0];
    if (!targetUser) {
        conn.reply(message.chat, '《✧》Debes mencionar a un usuario valido.', message);
        return;
    }

    let personajeNombre = args.slice(1).join(' ').trim().toLowerCase();
    let sender = message.sender;
    let datos = obtenerDatos();
    let inventarioUsuario = datos.usuarios[sender];

    if (!inventarioUsuario || inventarioUsuario.characters.length === 0) {
        conn.reply(message.chat, '《✧》No tienes personajes en tu inventario.', message);
        return;
    }

    let personajeIndex = inventarioUsuario.characters.findIndex(p => p.name.trim().toLowerCase() === personajeNombre);

    if (personajeIndex === -1) {
        conn.reply(message.chat, `《✧》El personaje ${personajeNombre} no está en tu inventario.`, message);
        return;
    }

    let personajes = obtenerPersonajes();
    let personaje = personajes.find(p => p.name.trim().toLowerCase() === personajeNombre);

    if (!personaje) {
        conn.reply(message.chat, `《✧》No se encontró el personaje ${personajeNombre} en la base de datos.`, message);
        return;
    }

    let personajeTransferido = {
        'name': inventarioUsuario.characters[personajeIndex].name,
        'value': personaje.value,
        'url': personaje.url
    };

    let inventarioDestinatario = datos.usuarios[targetUser];
    if (!inventarioDestinatario) {
        inventarioDestinatario = { 'characterCount': 0, 'totalRwcoins': 0, 'characters': [] };
    }

    inventarioDestinatario.characters.push({
        'name': personajeTransferido.name,
        'url': personajeTransferido.url,
        'value': personajeTransferido.value
    });

    inventarioDestinatario.characterCount++;
    inventarioDestinatario.totalRwcoins += personajeTransferido.value;
    datos.usuarios[targetUser] = inventarioDestinatario;

    inventarioUsuario.characters.splice(personajeIndex, 1);
    inventarioUsuario.characterCount--;
    inventarioUsuario.totalRwcoins -= personajeTransferido.value;
    datos.usuarios[sender] = inventarioUsuario;

    guardarDatos(datos);

    let targetUserName = await conn.getName(targetUser);
    let senderName = await conn.getName(sender);
    let messageText = `《✧》El personaje ${personajeTransferido.name}\nAhora es de @${targetUser.split('@')[0]}\nAdemás, obtienes ${personajeTransferido.value} RWCoins`;

    await conn.sendMessage(
        message.chat,
        { 'image': { 'url': personajeTransferido.url }, 'caption': messageText, 'mentions': [targetUser, sender] },
        { 'quoted': message }
    );
};

handler.command = ['darrw'];
handler.tags = ['gacha'];
handler.help = ['darrw'];
handler.register = true;

export default handler;
