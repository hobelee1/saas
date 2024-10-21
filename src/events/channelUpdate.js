const { AuditLogEvent } = require('discord.js');

module.exports = {
	name: 'channelUpdate',
	async execute(oldChannel, newChannel, client, dbl, db) {
    const fetchedLogs = await oldChannel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelOverwriteUpdate, limit: 1 });
    const firstEntry = fetchedLogs.entries.first();
    
    if(oldChannel.guild.members.cache.get(firstEntry.executorId).id === oldChannel.guild.ownerId || db.get(`verify_${newChannel.guild.id}`)?.includes(firstEntry.executorId) || firstEntry.executorId === client.user.id || !db.get(`guards_${oldChannel.guild.id}.ChannelUpdate`)) return;
    newChannel.permissionOverwrites.set(oldChannel.permissionOverwrites.cache);
	},
};
