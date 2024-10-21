const { AuditLogEvent } = require('discord.js');

module.exports = {
	name: 'emojiDelete',
	async execute(emoji, client, dbl, db) {
    const fetchedLogs = await emoji.guild.fetchAuditLogs({ type: AuditLogEvent.EmojiDelete, limit: 1 });
    const firstEntry = fetchedLogs.entries.first();
    
    if(emoji.guild.members.cache.get(firstEntry.executorId).id === emoji.guild.ownerId || db.get(`verify_${emoji.guild.id}`)?.includes(firstEntry.executorId) || firstEntry.executorId === client.user.id ||!db.get(`guards_${emoji.guild.id}.EmojiDelete`)) return;
    emoji.guild.emojis.create({ attachment: emoji.url, name: emoji.name }).catch(() => {});
  },
};
