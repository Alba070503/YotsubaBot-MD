
import fs from 'fs/promises';
import { JSON } from 'json';

const dataPath = './data.json';

// Carga datos en memoria al iniciar
let datos = {};
async function cargarDatos() {
 try {
  const file = await fs.readFile(dataPath, 'utf8');
  datos = JSON.parse(file);
 } catch (error) {
  console.error('Error al cargar datos:', error);
 }
}

// Función para guardar datos
async function guardarDatos(data) {
 try {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
 } catch (error) {
  console.error('Error al guardar datos:', error);
 }
}

// Verifica permisos del usuario
function verificarPermisos(usuario) {
 // Lógica para verificar permisos
 // Ejemplo: return usuario.admin;
 return true; // Temporalmente permitido para todos
}

// Extrae información del personaje
function extraerInformacion(caption) {
 const match = caption.match(/✰ Nombre:\n> » (.+)/);
 if (!match) {
  throw new Error('No se encontró coincidencia en la caption');
 }
 return match[1];
}

// Reclama personaje
async function reclamarPersonaje(m, { conn, text, quoted }) {
 try {
  const sender = m.sender;
  const caption = quoted.message.imageMessage.caption || '';
  
  // Validación de entrada
  if (!caption.trim()) {
   throw new Error('Caption vacío');
  }
  
  // Verifica permisos del usuario
  if (!verificarPermisos(sender)) {
   throw new Error('No tienes permisos para reclamar personajes');
  }
  
  const personajeNombre = extraerInformacion(caption);
  
  // Verificar si el personaje ya fue reclamado
  if (datos.usuarios[sender] && datos.usuarios[sender].characters.includes(personajeNombre)) {
   throw new Error('El personaje ya ha sido reclamado');
  }
  
  // Reclamar personaje
  datos.usuarios[sender] = datos.usuarios[sender] || { characters: [] };
  datos.usuarios[sender].characters.push({ name: personajeNombre, date: new Date().toISOString() });
  
  // Guardar datos
  await guardarDatos(datos);
  
  // Confirmación
  const message = `*${personajeNombre}* ha sido reclamado por *@${sender.split('@')[0]}*.`;
  await conn.sendMessage(m.chat, { text: message, mentions: [sender] });
 } catch (error) {
  console.error('Ocurrió un error:', error);
  await conn.sendMessage(m.chat, { text: `Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.\n${error}` });
 }
}

// Handler para el comando 'reclamar'
const handler = async (m, { conn, text, quoted }) => {
 try {
  // Verificar que el mensaje sea una respuesta válida
  if (!quoted || !quoted.message || !quoted.message.imageMessage) {
   const message = 'Debes responder al mensaje del personaje que deseas reclamar.';
   await conn.sendMessage(m.chat, { text: message });
   return;
  }
  
  await reclamarPersonaje(m, { conn, text, quoted });
 } catch (error) {
  console.error('Ocurrió un error:', error);
  await conn.sendMessage(m.chat, { text: `Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.\n${error}` });
 }
};

handler.help = ['reclamar'];
handler.tags = ['gacha'];
handler.command = ['reclamar', 'claim'];
handler.limit = false;

// Inicia el servidor
cargarDatos().then(() => {
 // Lógica para iniciar el servidor
});

export default handler;
```

