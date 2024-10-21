const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client, dbl, db) {
    const logId = db.get(`logs_${oldMessage.guild.id}.MessageUpdate`);
    if(!logId || oldMessage.author.bot) return;
    client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
      .setTitle("Bir Mesaj Düzenlendi!")
      .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Mesaj Sahibi:** <@${oldMessage.member.id}> (\`${oldMessage.member.id}\`)\n**Mesaj:** ${newMessage.url}\n**Eski Mesaj:** ${oldMessage.content.slice(0, 1500)}\n**Yeni Mesaj:** ${newMessage.content.slice(0, 1500)}`)
      .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: oldMessage.guild.iconURL() })
    ] });
  },
};
