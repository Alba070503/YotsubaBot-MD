 const handler = async (m, { conn }) => {
  const taguser = '@GataDios'; // Usuario etiquetado en el mensaje
  
  // Mensaje de cumpleaños
  const birthdayMessage = `
Hoy celebramos el cumpleaños de alguien verdaderamente especial, ${taguser}, una persona que no solo es admirable por todo lo que hace, sino también por la increíble calidad humana que tiene. Gracias por ser ese faro de inspiración para quienes te rodeamos, por tu dedicación, por compartir tu conocimiento, y por ser un ejemplo de esfuerzo, talento y bondad.

Espero que este día esté lleno de momentos mágicos, rodeado de tus seres queridos y con el cariño de todos los que te valoramos. Que cada sonrisa que regales hoy sea devuelta con mil abrazos, y que la felicidad te acompañe en cada paso que des.

Te deseo un cumpleaños lleno de bendiciones, amor y alegría 🎂🎉. Que todos tus sueños se cumplan, que cada meta que te propongas la alcances con éxito, y que nunca falten motivos para sonreír. Sigue brillando como siempre lo haces, porque tu luz es única e irremplazable.

¡Disfruta muchísimo de tu día, porque te lo mereces todo y más! ❤️✨🎁

Atte: @Alba070505
`;

  // Enviar el mensaje de cumpleaños
  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/hkntd1.jpg' }, // Imagen
    caption: birthdayMessage, // Mensaje
    mentions: [m.sender], // Mención del usuario
    footer: "🎉🎂 Felicidades",
  }, { quoted: m });

  // Enviar el audio de cumpleaños
  await conn.sendMessage(m.chat, {
    audio: { url: 'https://files.catbox.moe/bgk49x.mp3' }, // Audio
    mimetype: 'audio/mpeg',
    ptt: false, // Cambia a true si prefieres enviarlo como nota de voz
  }, { quoted: m });
};

handler.command = /^(Gata)$/i; // Define el comando

export default handler;
