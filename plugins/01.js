import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const taguser = '@' + m.sender.split('@')[0]; // Obtiene el usuario etiquetado

  conn.sendMessage(m.chat, {
    image: { url: 'https://qu.ax/MFOVJ.jpg' },
    caption: `You like me? ${taguser}`, // Mención visible del usuario
    footer: "Sock",
    buttons: [
      {
        buttonId: ".gay",
        buttonText: {
          displayText: "Yes",
        },
        type: 1,
      },
      {
        buttonId: ".play2 felices los 4",
        buttonText: {
          displayText: "No",
        },
        type: 1,
      },
    ],
    viewOnce: true,
    headerType: 4,
    mentions: [m.sender], // Mención funcional
    mentionedJid: await conn.parseMention(`You like me? ${taguser}`)
  }, { quoted: m });
};

handler.command = /^(test3)$/i; // Define el comando

export default handler;