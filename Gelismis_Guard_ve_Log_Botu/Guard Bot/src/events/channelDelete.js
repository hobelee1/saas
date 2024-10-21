const { AuditLogEvent } = require('discord.js');

module.exports = {
	name: 'channelDelete',
	async execute(channel, client, dbl, db) {
    const fetchedLogs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 });
    const firstEntry = fetchedLogs.entries.first();
    if(channel.guild.members.cache.get(firstEntry.executorId).id === channel.guild.ownerId || db.get(`verify_${channel.guild.id}`)?.includes(firstEntry.executorId) || firstEntry.executorId === client.user.id || !db.get(`guards_${channel.guild.id}.ChannelDelete`)) return;
    const newChannel = await channel?.clone().catch(e => {});
	},
};
