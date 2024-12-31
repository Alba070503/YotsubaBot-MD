import fetch from 'node-fetch';

let handler = async (m, { conn, participants, groupMetadata }) => {
    let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu);
    let name = conn.getName(m.sender)

    let welcomeMessage = `*╭┈⊰* ${groupMetadata.subject} *⊰┈ ✦*\n`;
    welcomeMessage += `*┊ 👋 ¡Hola ${name}!*\n`;
    welcomeMessage += `*┊ 📜 No olvides revisar la descripción del grupo para más detalles.*\n`;
    welcomeMessage += `*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰ ✦*\n\n`;
    welcomeMessage += `${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> *Yotsuba Bot - MD* 🌻🐈'}`;

    let buttons = [
        { buttonId: ".hola", buttonText: { displayText: 'Hola. 🤍' }, type: 1 },
        { buttonId: ".hello", buttonText: { displayText: 'Welcome. ✨' }, type: 1 }
    ];

    let fakeContext = {
        contextInfo: {
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: true,
                title: name,
                body: 'Bienvenido mi reiy/reina. ✨🫶',
                mediaUrl: null,
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: ppch,
                sourceUrl: 'https://senko-seven.vercel.app',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    };

    let buttonMessage = {
        image: { url: ppch },
        caption: welcomeMessage,
        footer: wm,
        buttons: buttons,
        viewOnce: true,
        headerType: 4,
        ...fakeContext
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: null });
}

handler.command = ['testwelcome'];
handler.group = true;
handler.admin = true;

export default handler;