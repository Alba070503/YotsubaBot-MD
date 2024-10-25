import axios from 'axios';
const { proto, generateWAMessageFromContent, generateWAMessageContent } = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) return conn.reply(message.chat, '🍟 *Por favor, proporciona el enlace de TikTok.*', message);
    
    try {
        await message.react('⏳');
        conn.reply(message.chat, '🚩 *Descargando su video...*', message);

        // URL for downloading TikTok video
        const downloadUrl = `https://deliriussapi-oficial.vercel.app/download/tiktok?url=${encodeURIComponent(text)}`;
        
        let { data: response } = await axios.get(downloadUrl);
        
        if (!response || !response.videoUrl) {
            throw new Error('No se pudo obtener el video.');
        }

        const videoMessage = await generateWAMessageContent({ video: { url: response.videoUrl } }, { upload: conn.waUploadToServer });
        
        const responseMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: '🚩 Video descargado de TikTok' }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '🔎 TikTok - Descarga' }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true, videoMessage }),
                    })
                }
            }
        }, { quoted: message });

        await message.react('✅');
        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

    } catch (error) {
        await conn.reply(message.chat, error.toString(), message);
    }
};

handler.help = ['tiktokdownload <link>'];
handler.tags = ['descargas'];
handler.command = ['tiktokdownload', 'tiktokdl'];

export default handler;
