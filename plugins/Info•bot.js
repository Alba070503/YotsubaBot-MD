import fs from 'fs';
const handler = (m) => m;
handler.all = async function(m) {

const chat = global.db.data.chats[m.chat];
if (chat.isBaneed) return
if (/^bot$/i.test(m.text)) {
conn.reply(m.chat, `🚩 ¡Hola! Soy Yotsuba Nakano, en que puedo ayudarte hoy?\n\n✰ Usa *!menu* para ver mis comandos.`, m)
}

if (/^que|ke|q|k|que?|ke?|k?|q?$/i.test(m.text)) {
conn.reply(m.chat, `*So* 🧀`, m)
}
if (/^a$/i.test(m.text)) {
conn.reply(m.chat, `*rroz* 🍚`, m)
}
if (/^sexo$/i.test(m.text)) {
conn.reply(m.chat, `*polno* 😟🙈`, m)
}
if (/^pene$/i.test(m.text)) {
conn.reply(m.chat, `*comes* 😹`, m)
}
return !0;
};
export default handler;
