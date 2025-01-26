import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    // Crear el mensaje con formato
    let menu = `
🍀 *I N F O - L A N C E L O T*

🎉 *¡LANCELOTGames: 16 años haciendo historia!* 🎉
⚔️ Zombie Escape y Minecraft, juntos en la comunidad más épica de *LATINOAMÉRICA*. ⚔️

🌟 *LANCELOTCRAFT – Aventuras épicas en Minecraft* 🌟
Descubre un servidor lleno de posibilidades donde podrás:
🔹 Completar misiones épicas y ganar grandes recompensas.
🔹 Construir en un mundo renovado, lleno de secretos y desafíos.
🔹 Participar en eventos únicos y convertirte en una leyenda.
🔹 Disfrutar de un sistema de trabajos, economía y protecciones que hará tu experiencia más divertida.

💬 Únete a nuestra comunidad de Discord para más información y para acceder a la IP:
🔗 *https://discord.gg/lancelotgames*

🧟 *¡Zombie Escape – Sobrevive al apocalipsis!* 🧟
Prepárate para luchar contra hordas interminables de zombis en mapas increíbles con:
🔹 Skins clásicas que regresan para revivir grandes recuerdos.
🔹 Eventos semanales con premios increíbles para los mejores jugadores.
🔹 Experiencia X6 activa en mapas seleccionados para que subas de nivel más rápido.

🎁 *¡Sorteos increíbles todos los meses!*
En *LANCELOTGames*, mes a mes realizamos sorteos de VIPs y Administradores, tanto para nuestro servidor de Minecraft como Zombie Escape. ¡Participa y gana grandes beneficios exclusivos!

🚀 *16 años de diversión y comunidad:*
LANCELOTGames lleva más de una década siendo el lugar donde jugadores de toda LATINOAMÉRICA se reúnen para vivir experiencias únicas. ¡Gracias a cada uno de ustedes por hacer esto posible!

🎮 *Conéctate al Zombie Escape:*
💻 IP: *104.234.65.245:27200*

🔔 ¡Únete a la leyenda y sé parte de LANCELOTGames!
🏰 *LEMA DE LANCELOTGames:* *Todos para uno y uno para todos.*
🌍 *LANCELOTGames: Diversión, comunidad y leyendas desde hace 16 años.* 🌍
`;

    // Enviar el mensaje enriquecido con externalAdReply
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        externalAdReply: {
          title: '❑— LANCELOTCRAFT —❑\nLa comunidad épica de LATINOAMÉRICA',
          thumbnailUrl: 'https://files.catbox.moe/ym1tdm.png', // Cambia este enlace por tu imagen
          sourceUrl: 'https://discord.gg/lancelotgames', // URL externa
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });

    // Reaccionar al mensaje original
    if (m.react) await m.react('⚔️');
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al procesar el comando.');
  }
};

handler.help = ['lancelotinfo'];
handler.tags = ['info'];
handler.command = ['lancelotinfo', 'info'];

export default handler;
