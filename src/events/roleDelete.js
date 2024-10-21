const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roleDelete',
  async execute(role, client, dbl, db) {
    // 1 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const fetchedLogs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 });
      const firstEntry = fetchedLogs.entries.first();
      
      // Silinen rolün adı
      const deletedRoleName = role.name;

      // Silen kişinin bilgisi
      let executorId, executor;
      if (firstEntry && Date.now() - firstEntry.createdTimestamp < 5000) { // 5 saniye içinde kontrol et
        executorId = firstEntry.executor.id;
        executor = firstEntry.executor;
      } else {
        executorId = 'Bilinmiyor';
        executor = { tag: 'Bilinmiyor' };
      }

      // Log kanalına bilgi gönder
      const logId = db.get(`logs_${role.guild.id}.RoleDelete`);
      client.channels.cache.get(logId)?.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Bir Rol Silindi!")
            .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${executorId}> (\`${executorId}\`)\n**Silinen Rol:** ${deletedRoleName}`)
            .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: role.guild.iconURL() })
        ]
      });

      // Silinen rolü geri oluştur (isteğe bağlı)
      if (!db.get(`guards_${role.guild.id}.RoleDelete`)) {
        await role.guild.roles.create(role.toJSON())
          .then(async x => await x.setPosition(role.position - 1))
          .catch(e => console.error('Rol geri oluşturulurken bir hata oluştu:', e));
      }
    } catch (error) {
      console.error('Rol silme kaydını alırken bir hata oluştu:', error);
    }
  },
};
