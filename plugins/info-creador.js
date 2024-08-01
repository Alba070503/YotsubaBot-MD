import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  const nomorown = '59169082575'; 
  const dev = 'Desarrollador'; 
  const packname = 'Numero Official'; 

 
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let pp = await conn.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
  let biografia = await conn.fetchStatus(nomorown + '@s.whatsapp.net').catch(_ => ({ status: 'Sin Biografía' }));
  let biografiaBot = await conn.fetchStatus(`${conn.user.jid.split('@')[0]}@s.whatsapp.net`).catch(_ => ({ status: 'Sin Biografía' }));
  let bio = biografia.status || 'Sin Biografía';
  let biobot = biografiaBot.status || 'Sin Biografía';
  let name = await conn.getName(who);

  await sendContactArray(conn, m.chat, [
    [nomorown, '🍁 Powered @Alba070503', 'Alba070503', dev, 'Alba070503@hotmail.com', '🇧🇴 Bolivia', `${global.yt}`, bio],
    [`${conn.user.jid.split('@')[0]}`, 'Es Una Bot 🤍', packname, '📵 No Hacer Spam', 'alba070503@hotmail.com', '🇲🇽 Mexico', 'https://github.com/Rey-AyanamiBot-MD', biobot]
  ], m);
};

handler.help = ['creador', 'owner'];
handler.tags = ['info'];
handler.command = /^(owner|creador)$/i;
export default handler;

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
  let contacts = [];
  for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
    number = number.replace(/[^0-9]/g, '');
    let njid = number + '@s.whatsapp.net';
    let biz = await conn.getBusinessProfile(njid).catch(_ => null) || {};
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${new PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
item2.EMAIL;type=INTERNET:${isi2}
item2.X-ABLabel:📧 Email
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:🏷 Region
item4.URL:${isi4}
item4.X-ABLabel:Website
item5.X-ABLabel:${isi5}
END:VCARD`.trim();
    contacts.push({ vcard, displayName: name });
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null,
      contacts,
    }
  }, {
    quoted,
    ...options
  });
}
