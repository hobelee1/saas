const { AuditLogEvent, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'guildAuditLogEntryCreate',
	async execute(auditLog, guild, client, dbl, db) {
    if(auditLog.executorId === client.user.id) return;
    if(!auditLog.executorId || auditLog.executorId === client.user.id) return;
    const owner = client.guilds.cache.get(guild.id)?.ownerId == auditLog.executorId;
    if(auditLog.action === AuditLogEvent.ChannelCreate) {
      await jail("İzinsiz kanal oluşturma.", "ChannelCreate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.ChannelCreate`)) auditLog.target.delete().catch(e => {});
      const logId = db.get(`logs_${guild.id}.ChannelCreate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Kanal Oluşturuldu!")
        .setDescription(`**Oluşturulma Tarihi:** <t:${Math.floor(auditLog.target.createdTimestamp/1000)}>\n**Oluşturan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Kanal İsmi:** ${auditLog.target.name}\n**Kanal Tipi:** ${auditLog.target.type==0 ? "Yazı" : auditLog.target.type==2 ? "Ses" : auditLog.target.type==15 ? "Forum" : auditLog.target.type==5 ? "Duyuru" : auditLog.target.type==13 ? "Etkinlik" : auditLog.target.type==4 ? "Kategori" : auditLog.target.type}\n**Kanal Açıklaması:** ${auditLog.target.topic?channel.topic:"Yok"}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.ChannelDelete) {
      await jail("İzinsiz kanal silme.", "ChannelDelete");
      const logId = db.get(`logs_${guild.id}.ChannelDelete`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Kanal Silindi!")
        .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Kanal İsmi:** ${auditLog.target.name}\n**Kanal Tipi:** ${auditLog.target.type==0 ? "Yazı" : auditLog.target.type==2 ? "Ses" : auditLog.target.type==15 ? "Forum" : auditLog.target.type==5 ? "Duyuru" : auditLog.target.type==13 ? "Etkinlik" : auditLog.target.type==4 ? "Kategori" : auditLog.target.type}\n**Kanal Açıklaması:** ${auditLog.target.topic?channel.topic:"Yok"}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.ChannelUpdate) {
      await jail("İzinsiz kanal düzenleme.", "ChannelUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.ChannelUpdate`)) guild.channels.cache.get(auditLog.targetId)?.edit(JSON.parse("{"+auditLog.changes.map(x => `"${x.key}": "${x.old}"`).join(", ")+"}")).catch(e=>{});
      const logId = db.get(`logs_${guild.id}.ChannelUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Kanal'ın Özellikleri Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Kanal İsmi:** ${auditLog.target.name}\n**Kanal Tipi:** ${auditLog.target.type==0 ? "Yazı" : auditLog.target.type==2 ? "Ses" : auditLog.target.type==15 ? "Forum" : auditLog.target.type==5 ? "Duyuru" : auditLog.target.type==13 ? "Etkinlik" : auditLog.target.type==4 ? "Kategori" : auditLog.target.type}\n**Kanal Açıklaması:** ${auditLog.target.topic?channel.topic:"Yok"}\n**Değiştirilen Özellikler:** ${auditLog.changes.map(x => x.key).join(",")}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    }
     else if(auditLog.action === AuditLogEvent.ChannelOverwriteUpdate) {
      await jail("İzinsiz kanal izni düzenleme.", "ChannelOverwriteUpdate");
      const logId = db.get(`logs_${guild.id}.ChannelOverwriteUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Kanal'ın İzinleri Değiştirildi!")
        .setDescription(`**Değiştirilme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Değiştiren Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Kanal İsmi:** ${auditLog.target.name}\n**Kanal Tipi:** ${auditLog.target.type==0 ? "Yazı" : auditLog.target.type==2 ? "Ses" : auditLog.target.type==15 ? "Forum" : auditLog.target.type==5 ? "Duyuru" : auditLog.target.type==13 ? "Etkinlik" : auditLog.target.type==4 ? "Kategori" : auditLog.target.type}\n**Kanal Açıklaması:** ${auditLog.target.topic?channel.topic:"Yok"}\n**Değiştirilen Özellikler:** \`Çok Yakında...\``)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.RoleCreate) {
      await jail("İzinsiz rol oluşturma.", "RoleCreate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.RoleCreate`)) guild.roles.cache.get(auditLog.targetId)?.delete().catch(e => {});
      const logId = db.get(`logs_${guild.id}.RoleCreate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Rol Oluşturuldu!")
        .setDescription(`**Oluşturulma Tarihi:** <t:${Math.floor(auditLog.target.createdTimestamp/1000)}>\n**Oluşturan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Rol İsmi:** ${auditLog.target.name}\n**Admin Yetkisi var mı:** ${auditLog.target.permissions.has("Administrator") ? "Var" : "Yok"}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.RoleDelete) {
      await jail("İzinsiz rol silme.", "RoleDelete");
      const logId = db.get(`logs_${guild.id}.RoleDelete`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Rol Silindi!")
        .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Rol İsmi:** ${auditLog.target.name}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.RoleUpdate) {
      await jail("İzinsiz rol düzenleme.", "RoleUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.RoleUpdate`)) guild.roles.cache.get(auditLog.targetId)?.edit(JSON.parse("{"+auditLog.changes.map(x => `"${x.key}": ${typeof x.old == "string"?`"${x.old}"`:x.old}`).join(", ")+"}")).catch(e=>{});
      const logId = db.get(`logs_${guild.id}.RoleUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Rol Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Rol İsmi:** ${auditLog.target.name}\n**Yönetici Yetkisi var mı:** ${auditLog.target.permissions.has("Administrator") ? "Var" : "Yok"}`)  
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.EmojiCreate) {
      await jail("İzinsiz emoji ekleme.", "EmojiCreate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.EmojiCreate`)) guild.emojis.cache.get(auditLog.targetId).delete().catch(x => {});
      const logId = db.get(`logs_${guild.id}.EmojiCreate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Emoji Oluşturuldu!")
        .setDescription(`**Oluşturulma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Oluşturan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Emoji İsmi:** ${auditLog.target.name}\n**Emoji:** ${auditLog.target.url}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.EmojiDelete) {
      await jail("İzinsiz emoji silme.", "EmojiDelete");
      const logId = db.get(`logs_${guild.id}.EmojiDelete`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Emoji Silindi!")
        .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Emoji İsmi:** ${auditLog.target.name}\n**Emoji:** ${auditLog.target.url}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.EmojiUpdate) {
      await jail("İzinsiz emoji düzenleme.", "EmojiUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.EmojiUpdate`)) guild.emojis.cache.get(auditLog.targetId)?.edit(JSON.parse("{"+auditLog.changes.map(x => `"${x.key}": ${typeof x.old == "string"?`"${x.old}"`:x.old}`).join(", ")+"}")).catch(e=>{});
      const logId = db.get(`logs_${guild.id}.EmojiUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Emoji Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Emoji İsmi:** ${auditLog.target.name}\n**Emoji:** https://cdn.discordapp.com/emojis/${auditLog.targetId}.png`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.WebhookCreate) {
      await jail("İzinsiz webhook oluşturma.", "WebhookCreate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.WebhookCreate`)) auditLog.target.delete().catch(e=>{});
      const logId = db.get(`logs_${guild.id}.WebhookCreate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Webhook Oluşturuldu!")
        .setDescription(`**Oluşturulma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Oluşturan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Webhook İsmi:** ${auditLog.target.name} (\`${auditLog.targetId}\`)\n**Webhook Kanalı:** <#${auditLog.target.channelId}>`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.WebhookDelete) {
      await jail("İzinsiz webhook silme.", "WebhookDelete");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.WebhookDelete`)) guild.channels.cache.get(auditLog.target.channelId)?.createWebhook({
        name: auditLog.target.name,
        avatar: auditLog.changes.find(x=>x.key=="avatar_hash")?`https://cdn.discordapp.com/avatars/${auditLog.targetId}/${auditLog.changes.find(x=>x.key=="avatar_hash").old}.png` : null,
        type: auditLog.changes.find(x=>x.key=="type").old
      })
      const logId = db.get(`logs_${guild.id}.WebhookDelete`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Webhook Silindi!")
        .setDescription(`**Silinme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Silen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Webhook İsmi:** ${auditLog.target.name} (\`${auditLog.targetId}\`)\n**Webhook Kanalı:** <#${auditLog.target.channelId}>`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.WebhookUpdate) {
      await jail("İzinsiz webhook düzenleme.", "WebhookUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.WebhookUpdate`)) {
        const webhooks = await guild.fetchWebhooks().catch(e=>{});
        const webhook = webhooks?.find(x => x.id === auditLog.targetId);
        await webhook.edit(JSON.parse("{"+auditLog.changes.map(x => {
          if(x.key == "avatar_hash") {
            if(x.old == undefined) return `"avatar": null`;
            else return `"avatar": "https://cdn.discordapp.com/avatars/${auditLog.targetId}/${x.old}.png"`;
          } else if(x.key == "channel_id") return `"channel": "${x.old}"`;
          else return `"${x.key}": ${x.old == undefined?null:`"${x.old}"`}`;
        }).join(", ")+"}")).catch(e=>{});
      }
      const logId = db.get(`logs_${guild.id}.WebhookUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Webhook Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Webhook İsmi:** ${auditLog.target.name} (\`${auditLog.targetId}\`)\n**Değişiklikler:** ${auditLog.changes.map(x=>x.key).join(", ")}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] })
    } else if(auditLog.action === AuditLogEvent.MemberBanAdd) {
      await jail("İzinsiz üye yasaklama.", "MemberBanAdd");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.MemberBanAdd`)) guild.members.unban(auditLog.targetId).catch(e=>{});
      const logId = db.get(`logs_${guild.id}.MemberBanAdd`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Üye Yasaklandı!")
        .setDescription(`**Yasaklanma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Yasaklayan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Yasaklanan Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n**Yasaklanma Nedeni:** ${auditLog.reason ?? "Belirtilmemiş."}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.MemberBanRemove) {
      await jail("İzinsiz üyenin yasağını kaldırma.", "MemberBanRemove");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.MemberBanRemove`)) guild.members.ban(auditLog.targetId).catch(e=>{});
      const logId = db.get(`logs_${guild.id}.MemberBanRemove`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Üyenin Yasağı Kaldırıldı!")
        .setDescription(`**Yasak Kaldırılma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Yasağı Kaldıran Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Yasağı Kaldırılan Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.MemberPrune) {
      await jail("İzinsiz toplu üye atma (Prune).", "MemberPrune");
      const logId = db.get(`logs_${guild.id}.MemberPrune`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Toplu Üye Atıldı! (Prune)")
        .setDescription(`**Atılma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Atan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Atılan Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n**Atılan kullanıcı sayısı:** ${auditLog.extra?.removed}\n**Kaç günlük üyeler atıldı:** ${auditLog.extra?.days}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.MemberKick) {
      await jail("İzinsiz üye atma.", "MemberKick");
      const logId = db.get(`logs_${guild.id}.MemberKick`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Üye Atıldı!")
        .setDescription(`**Atılma Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Atan Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Atılan Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n**Atılma Nedeni:** ${auditLog.reason ?? "Belirtilmemiş."}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.MemberRoleUpdate) {
      await jail("İzinsiz rol verme/alma.", "MemberRoleUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.MemberRoleUpdate`)) {
        let member = guild.members.cache.get(auditLog.targetId) || await guild.members.fetch(auditLog.targetId);
        auditLog.changes.forEach(change => {
          if(change.key === "$add") change.new.forEach(role => member.roles.remove(role.id).catch(e=>{}));
          else if(change.key === "$remove") change.new.forEach(role => member.roles.add(role.id).catch(e=>{}));
        })
      } 
      const logId = db.get(`logs_${guild.id}.MemberRoleUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Üyenin Rolleri Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Düzenlenen Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n${auditLog.changes.map(change => {
          if(change.key === "$add") return `**Eklenen Roller:** <@&${change.new.map(role => role.id).join(">, <@&")}>`;
          else if(change.key === "$remove") return `**Kaldırılan Roller:** <@&${change.new.map(role => role.id).join(">, <@&")}>`;
        }).join("\n")}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.MemberUpdate) {
      await jail("İzinsiz üye düzenleme.", "MemberUpdate");
      if(!owner && !db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.MemberUpdate`)) {
        let member = guild.members.cache.get(auditLog.targetId) || await guild.members.fetch(auditLog.targetId);
        auditLog.changes.forEach(change => {
          if(change.key === "nick") member.setNickname(change.old ?? null).catch(e=>{});
        })
      }
      const logId = db.get(`logs_${guild.id}.MemberUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Bir Üye Düzenlendi!")
        .setDescription(`**Düzenlenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Düzenleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Düzenlenen Üye:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n**Düzenlenen Özellikler:** ${auditLog.changes.map(x => x.key).join("\n")}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    } else if(auditLog.action === AuditLogEvent.BotAdd) {
      await jail("İzinsiz bot ekleme.", "BotAdd");
      const member = guild.members.cache.get(auditLog.targetId);
      if(!db.get(`verify_${guild.id}`)?.includes(auditLog.executorId) && db.get(`guards_${guild.id}.MemberUpdate`)) member?.kick().catch(e=>{});
      const logId = db.get(`logs_${guild.id}.MemberUpdate`);
      if(!logId) return;
      client.channels.cache.get(logId)?.send({ embeds: [new EmbedBuilder()
        .setTitle("Sunucuya Bir Bot Eklendi!")
        .setDescription(`**Eklenme Tarihi:** <t:${Math.floor(Date.now()/1000)}>\n**Ekleyen Kişi:** <@${auditLog.executorId}> (\`${auditLog.executorId}\`)\n**Eklenen Bot:** ${auditLog.target.username} (\`${auditLog.targetId}\`)\n**Yönetici Yetkisi var mı:** ${member.permissions.has("Administrator") ? "Var" : "Yok"}`)
        .setFooter({ text: "www.youtube.com/@WraithsDev", iconURL: guild.iconURL() })
      ] });
    }


  //                 "Functions"                 //
  async function jail(reason, event) {
    if(owner) return;
    const member = guild.members.cache.get(auditLog.executorId);
    const rule = db.get(`rule_${guild.id}.${event}`);
    if(rule === "Nothing" || !rule) return;
    else if(rule === "RolesRemove") {
      await member.roles.cache.forEach(x => member.roles.remove(x.id).catch(e => {}));
      if(member.user.bot) member.roles.cache.at(0).setPermissions([]).catch(e => {});
    } else if(rule === "Kick") {
      member.kick({ reason: reason }).catch(async e => {
        await member.roles.cache.forEach(x => member.roles.remove(x.id).catch(e => {}));
        if(member.user.bot) member.roles.cache.at(0).setPermissions([]).catch(e => {});
      });
    } else if(rule === "Ban") {
      member.ban({ reason: reason }).catch(async e => {
        await member.roles.cache.forEach(x => member.roles.remove(x.id).catch(e => {}));
        if(member.user.bot) member.roles.cache.at(0).setPermissions([]).catch(e => {});
      });
    }
  }
 },
};