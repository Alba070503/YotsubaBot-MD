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

const handler = async (m, { conn }) => {
    try {
        const sender = m.sender;
        const datos = obtenerDatos();

        // Verificar si el usuario tiene un personaje reservado
        const usuario = datos.usuarios[sender];
        if (!usuario || !usuario.characters || usuario.characters.length === 0) {
            const message = '《✿》No tienes ningún personaje reservado. Usa *#rw* para generar uno.';
            await conn.sendMessage(m.chat, { text: message });
            return;
        }

        // Reclamar el personaje
        const personajeReclamado = usuario.characters.pop();
        guardarDatos(datos);

        const caption = `✿ ¡Has reclamado tu personaje! ✿\n\n• Nombre: ${personajeReclamado.name}\n• Valor: ${personajeReclamado.value} *YotsuCoins☘️*`;

        await conn.sendMessage(m.chat, { 
            image: { url: personajeReclamado.url },
            caption, 
            mimetype: 'image/jpeg',
        });

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
