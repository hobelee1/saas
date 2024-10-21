const { AuditLogEvent } = require('discord.js');

module.exports = {
	name: 'WebhookDelete',
	async execute(webhook, client, dbl, db) {
    const fetchedLogs = await webhook.guild.fetchAuditLogs({ type: AuditLogEvent.WebhookDelete, limit: 1 });
    const firstEntry = fetchedLogs.entries.first();
    
    if(webhook.guild.members.cache.get(firstEntry.executorId).id === webhook.guild.ownerId || db.get(`verify_${webhook.guild.id}`)?.includes(firstEntry.executorId) || firstEntry.executorId === client.user.id) return;
    webhook.guild.channels.cache.get(webhook.channelId)?.createWebhook({
      name: webhook.name,
      avatar: webhook.avatarURL()
    })
	},
};
