import fs from 'fs';
const handler = (m) => m;
handler.all = async function(m) {

const chat = global.db.data.chats[m.chat];
if (chat.isBaneed) return
if (/^bot$/i.test(m.text)) {
conn.reply(m.chat, `🚩 ¡Hola! Soy Yotsuba Nakano, en que puedo ayudarte hoy?\n\n✰ Usa *!menu* para ver mis comandos.`, m, rcanal, )
}

if (/^alba$/i.test(m.text)) {
conn.reply(m.chat, `*Hola Alba es mi creador si tienes un problema o dudas comunicate con el 👇\n\n> Wa.me/59169214837`, m, rcanal, )
}
if (/^ian|ianalejandrook15x$/i.test(m.text)) {
conn.reply(m.chat, `> *ianalejandrook15 es el staff oficial de YotsubaBot-MD si necesitas contactarte con el o quieres que te ayudes en tus proyectos te dejo su numero*\n\n> Wa.me/5493876639332\n\n> Pσɯҽɾҽԃ Bყ ιαɳαʅҽʝαɳԃɾσσƙ15x`, m, rcanal, )
}
if (/^problema$/i.test(m.text)) {
conn.reply(m.chat, `*Si presenta problemas o errores comunica al creador del bot* ⚠`, m, rcanal, )
}
if (/^pene$/i.test(m.text)) {
conn.reply(m.chat, `*comes* 😹`, m, rcanal, )
}
return !0;
};
export default handler;
