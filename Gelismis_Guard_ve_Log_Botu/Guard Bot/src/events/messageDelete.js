const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "messageDelete",
  async execute(message, client, dbl, db) {
    const logId = db.get(`logs_${message.guild.id}.MessageDelete`);
    if (message.author.bot || !logId) return;

    // 1 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const fetchedLogs = await message.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1
      });

      const firstEntry = fetchedLogs.entries.first();
      let executorId, executor;

      if (firstEntry && Date.now() - firstEntry.createdTimestamp < 5000) { // 5 saniye içinde kontrol et
        executorId = firstEntry.executor.id;
        executor = firstEntry.executor;
      } else {
        // Eğer mesajı silen kişi bulunamazsa, varsayılan olarak mesajın sahibi veya mesajı silen kişi ile ilgili bir bilgi verin
        executorId = message.author.id;
        executor = message.author;
      }

      client.channels.cache.get(logId)?.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Bir Mesaj Silindi!")
            .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${executorId}> (\`${executorId}\`)\n**Mesajı Silinen Üye:** <@${message.author.id}> (\`${message.author.id}\`)\n**Mesaj:** ${message.content?.slice(0, 3000) || "İçerik yok."}`)
            .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: message.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.error('Mesaj silme kaydı alınırken bir hata oluştu:', error);
    }
  },
};
