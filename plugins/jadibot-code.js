import pkg from "@whiskeysockets/baileys";
import moment from "moment-timezone";
import NodeCache from "node-cache";
import readline from "readline";
import qrcode from "qrcode";
import crypto from "crypto";
import fs from "fs";
import pino from "pino";
import * as ws from "ws";
const { CONNECTING } = ws;
import { Boom } from "@hapi/boom";
import { makeWASocket } from "../lib/simple.js";

const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = pkg;

if (!Array.isArray(global.conns)) global.conns = [];

const mssg = {
  nobbot: "𝙽𝚘 𝚙𝚞𝚎𝚍𝚎𝚜 𝚞𝚜𝚊𝚛 𝚎𝚕 𝚋𝚘𝚝 𝚛𝚎𝚖.",
  recon: "𝚁𝙴𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙽𝙳𝙾 𝚁𝙴𝙼 𝙱𝙾𝚃",
  sesClose: "𝙻𝙰 𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙵𝚄𝙴 𝙲𝙴𝚁𝚁𝙰𝙳𝙰",
  botqr: `𝚄𝚂𝙰 𝙴𝚂𝚃𝙴 𝙲𝙾𝙳𝙸𝙶𝙾 𝙿𝙰𝚁𝙰 𝚂𝙴𝚁 𝚂𝚄𝙱 𝙱𝙾𝚃.\n
> *\`𝙶𝚄𝙸𝙰:\`* \n
> *\`1\`* : 𝙷𝚊𝚐𝚊 𝚌𝚕𝚒𝚌𝚔 𝚎𝚗 𝚕𝚘𝚜 𝟹 𝚙𝚞𝚗𝚝𝚘𝚜\n
> *\`2\`* : 𝚃𝚘𝚚𝚞𝚎 𝚍𝚒𝚜𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚘𝚜 𝚟𝚒𝚗𝚌𝚞𝚕𝚊𝚍𝚘𝚜\n
> *\`3\`* : 𝚂𝚎𝚕𝚎𝚌𝚌𝚒𝚘𝚗𝚊 *𝚅𝚒𝚗𝚌𝚞𝚕𝚊𝚛 𝚌𝚘𝚗 𝚎𝚕 𝚗ú𝚖𝚎𝚛𝚘 𝚍𝚎 𝚝𝚎𝚕é𝚏𝚘𝚗𝚘*\n
> *\`4\`* : 𝙴𝚜𝚌𝚛𝚒𝚋𝚊 𝚎𝚕 𝙲𝚘𝚍𝚒𝚐𝚘\n\n
> \`Nota :\` 𝙴𝚜𝚝𝚎 𝙲ó𝚍𝚒𝚐𝚘 𝚜𝚘𝚕𝚘 𝚏𝚞𝚗𝚌𝚒𝚘𝚗𝚊 𝚎𝚗 𝚎𝚕 𝚗ú𝚖𝚎𝚛𝚘 𝚚𝚞𝚎 𝚕𝚘 𝚜𝚘𝚕𝚒𝚌𝚒𝚝𝚘`,
  connet: "𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 𝙴𝚂𝚃𝙰𝙱𝙻𝙴𝙲𝙸𝙳𝙰 𝙲𝙾𝙽 𝙴𝚇𝙸𝚃𝙾",
  connID: "𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 𝙴𝚂𝚃𝙰𝙱𝙻𝙴𝙲𝙸𝙳𝙰 𝙲𝙾𝙽 𝙴𝚇𝙸𝚃𝙾",
  connMsg: "𝙴𝙻 𝙱𝙾𝚃 𝚂𝙴 𝙰𝙷 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙴𝚇𝙸𝚃𝙾𝚂𝙰𝙼𝙴𝙽𝚃𝙴.",
};

let handler = async (
  m,
  { conn: _conn, args, usedPrefix, command, isOwner },
) => {
  let parent = _conn;

  async function bbts() {
    let authFolderB = crypto.randomBytes(10).toString("hex").slice(0, 8);

    if (!fs.existsSync("./bots/" + authFolderB)) {
      fs.mkdirSync("./bots/" + authFolderB, { recursive: true });
    }
    if (args[0]) {
      fs.writeFileSync(
        "./bots/" + authFolderB + "/creds.json",
        JSON.stringify(
          JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")),
          null,
          "\t",
        ),
      );
    }

    const { state, saveState, saveCreds } = await useMultiFileAuthState(
      `./bots/${authFolderB}`,
    );
    const msgRetryCounterCache = new NodeCache();
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid);
        let msg = await store.loadMessage(jid, clave.id);
        return msg?.message || "";
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
      version,
    };

    let conn = makeWASocket(connectionOptions);

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(`Connection closed due to ${lastDisconnect.error}, reconnecting ${shouldReconnect}`);
        if (shouldReconnect) {
          await bbts();
        } else {
          console.log('Session logged out');
        }
      } else if (connection === 'open') {
        console.log('Connection established');
      }
    });

    conn.ev.on('messages.upsert', (m) => {
      console.log(JSON.stringify(m, undefined, 2));

      const message = m.messages[0];
      if (!message.key.fromMe && message.key.remoteJid === 'status@broadcast') {
        conn.readMessages([message.key]);
      }
    });

    global.conns.push(conn);
    conn.isInit = false;

    conn.ev.on('creds.update', saveCreds);

    return conn;
  }

  let conn = await bbts();

  // Enviar presencia cada 5 minutos para mantener la conexión activa
  setInterval(() => {
    if (conn.state.connection === 'open') {
      conn.sendPresenceUpdate('available');
    }
  }, 300000); // 5 minutos

};

handler.help = ["botclone"];
handler.tags = ["bebot"];
handler.command =  ['bebot', 'serbot', 'jadibot', 'botclone', 'clonebot'];

export default handler
