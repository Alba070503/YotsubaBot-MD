import fs from 'fs';

const dataPath = './data.json';

const obtenerDatos = () => {
    try {
        return fs.existsSync(dataPath)
            ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
            : { usuarios: {}, personajesReservados: [] };
    } catch (error) {
        console.error('✿ Error al leer data.json:', error);
        return { usuarios: {}, personajesReservados: [] };
    }
};

const guardarDatos = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('✿ Error al escribir en data.json:', error);
    }
};

const handler = async (m, { conn, text, quoted }) => {
    try {
        const sender = m.sender;
        const datos = obtenerDatos();

        // Verificar que el mensaje sea una respuesta válida
        if (!quoted || !quoted.message || !quoted.message.imageMessage) {
            const message = '《✿》Debes responder al mensaje del personaje que deseas reclamar.';
            await conn.sendMessage(m.chat, { text: message });
            return;
        }

        // Extraer información del personaje del mensaje citado
        const caption = quoted.message.imageMessage.caption || '';
        const match = caption.match(/✰ Nombre:\n> » (.+)/);
        if (!match) {
            const message = '《✿》El mensaje citado no contiene información válida de un personaje.';
            await conn.sendMessage(m.chat, { text: message });
            return;
        }

        const personajeNombre = match[1];

        // Verificar si el personaje ya fue reclamado
        const personajeReclamado = Object.entries(datos.usuarios).find(([, user]) =>
            user.characters.some((char) => char.name === personajeNombre)
        );

        if (personajeReclamado) {
            const message = `《✿》El personaje *${personajeNombre}* ya ha sido reclamado por @${personajeReclamado[0].split('@')[0]}.`;
            await conn.sendMessage(m.chat, { text: message, mentions: [personajeReclamado[0]] });
            return;
        }

        // Reclamar el personaje para el usuario actual
        if (!datos.usuarios[sender]) datos.usuarios[sender] = { characters: [] };
        datos.usuarios[sender].characters.push({ name: personajeNombre, date: new Date().toISOString() });
        guardarDatos(datos);

        // Confirmación
        const message = `❤️‍🔥 *${personajeNombre}* ha sido reclamado por *@${sender.split('@')[0]}*.`;
        await conn.sendMessage(m.chat, { text: message, mentions: [sender] });

    } catch (error) {
        console.error('《✿》Ocurrió un error:', error);
        await conn.sendMessage(m.chat, { text: `《✿》Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.\n${error}` });
    }
};

handler.help = ['reclamar'];
handler.tags = ['gacha'];
handler.command = ['reclamar', 'claim'];
handler.limit = false;

export default handler;
