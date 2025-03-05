const fetch = require('node-fetch');
const baileys = require('baileys');

module.exports = {
  name: "pixai",
  alias: ["pixai"],
  category: "search",
  use: "<query>",
  example: "%cmd <query>",
  cooldown: 3,
  isSpam: true,
  isQuery: true,

  async run({ conn, msg }, { query }) {
    conn.sendMessage(msg.from, {
        react: {
          text: '⏱️',
          key: msg.key,
        },
      });
    const apiUrl = `https://api.dorratz.com/v2/pix-ai?prompt=${encodeURIComponent(query)}`;    
    try {
      const response = await fetch(apiUrl);      
       if (!response.ok) {
        throw new Error('Error en la red: ' + response.status);
      }
      const data = await response.json();
       if (!data.images || data.images.length === 0) {
        return msg.reply(`No se encontraron imágenes para la consulta`);
      }

      const medias = data.images.map(imageUrl => ({
        type: "image",
        data: { url: imageUrl }
      }));

      const caption = "🌙 request answered by api.dorratz.com";

      await sendAlbumMessage(conn, msg.from, medias, { caption, quoted: msg });
    } catch (error) {
      console.error('Error:', error);
      msg.reply(`Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.`);
    }
  }
};

async function sendAlbumMessage(conn, jid, medias, options) {
  options = { ...options };
  if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid} (${jid?.constructor?.name})`);
  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video"))
      throw new TypeError(`medias[i].type must be "image" or "video", received: ${media.type} (${media.type?.constructor?.name})`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
      throw new TypeError(`medias[i].data must be object with url or buffer, received: ${media.data} (${media.data?.constructor?.name})`);
  }
  if (medias.length < 2) throw new RangeError("Minimum 2 media");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(media => media.type === "image").length,
        expectedVideoCount: medias.filter(media => media.type === "video").length,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message,
              },
            }
          : {}),
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  for (const i in medias) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === "0" ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
    await baileys.delay(delay);
  }

  return album;
}
