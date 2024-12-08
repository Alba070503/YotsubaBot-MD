import fs from 'fs';
import path from 'path';

const watchDir = './';  // Directorio raíz del servidor
const ownerNumber = 'nuemrotuyo@s.whatsapp.net';

const notifyChanges = async (event, filePath, conn) => {
    let message = `Se ha detectado un cambio en el archivo: ${filePath}. Tipo de evento: ${event}`;
    await conn.sendMessage(ownerNumber, { text: message });
};

const startWatching = (conn) => {
    fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            const filePath = path.join(watchDir, filename);
            notifyChanges(eventType, filePath, conn);
        }
    });

    console.log(`Watching for changes in directory: ${watchDir}`);
};

let handler = async (m, { conn }) => {
    startWatching(conn);
};

//handler.help = ['monitor'];
//handler.tags = ['owner'];
handler.command = ['monitor', 'vigilar'];
handler.rowner = true;

export default handler;
