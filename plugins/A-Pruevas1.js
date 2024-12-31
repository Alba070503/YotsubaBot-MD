let handler = async (m, { conn }) => {
  try {
  m.reply('Hola bebé ✨️❤️')
  } catch (e) {
    console.error('Error al enviar hola', e);
  }}

handler.command = ['hola', 'hello']
export default handler;