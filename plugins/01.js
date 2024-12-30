import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  //const taguser = '@' + m.sender.split('@')[0]; 

  conn.sendMessage(m.chat, {
    image: { url: 'https://qu.ax/MFOVJ.jpg' },
    caption: `Alba es tu patrona?`, 
    footer: "Sock",
    buttons: [
      {
        buttonId: ".play hola remix",
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
  }, { quoted: m });
};

handler.command = /^(test3)$/i; 

export default handler;