import fetch from 'node-fetch';

let handler = async (m, { conn, participants, groupMetadata }) => {
    let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu);
    let name = conn.getName(m.sender);
    let senderId = m.sender.split('@')[0];

    let welcomeMessage = `*╭┈⊰* ${groupMetadata.subject} *⊰┈ ✦*\n`;
    welcomeMessage += `*┊ 👋 ¡Hola @${senderId}!*\n`; // Mención
    welcomeMessage += `*┊ 📜 No olvides revisar la descripción del grupo para más detalles.*\n`;
    welcomeMessage += `*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰ ✦*\n\n`;
    welcomeMessage += `${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> *Yotsuba Bot - MD* 🌻🐈'}`;

    let buttons = [
        { buttonId: ".hola", buttonText: { displayText: 'Hola. 🤍' }, type: 1 },
        { buttonId: ".hello", buttonText: { displayText: 'Welcome. ✨' }, type: 1 }
    ];


    let buttonMessage = {
        image: { url: ppch },
        caption: welcomeMessage,
        footer: wm,
        buttons: buttons,
        viewOnce: true,
        headerType: 4,
        mentions: [m.sender] 
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: null, mentions: [m.sender] });
}

handler.command = ['testwelcome'];
handler.group = true;

export default handler;