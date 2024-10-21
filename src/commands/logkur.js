const { ChannelType } = require('discord.js'); // Discord.js v14 için

module.exports = {
    name: 'logkur',
    description: 'Log kanallarını oluşturur.',
    enable: true,
    async execute(message, args, client) {
        console.log('Logkur komutu çalıştı!');
        
        // Eğer gerekli izinler varsa
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yeterli izniniz yok. (Yönetici)');
        }

        const guild = message.guild;
        const channels = [
            'kanal-log',
            'rol-log',
            'emoji-log',
            'webhook-log',
            'ban-kick-log',
            'onemli-log',
            'uye-log',
            'mesaj-log'
        ];
        const categoryName = 'Sunucu Log';

        try {
            // Kategori kontrolü ve silme
            let category = guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
            if (category) {
                // Kategorinin içindeki tüm kanalları sil
                const categoryChannels = guild.channels.cache.filter(c => c.parentId === category.id);
                for (const channel of categoryChannels.values()) {
                    await channel.delete('Eski kanal silindi');
                    console.log(`Kanal silindi: ${channel.name}`);
                }

                // Kategoriyi sil
                await category.delete('Eski kategori silindi');
                console.log('Kategori silindi: Sunucu Log');
            }

            // Kategori oluştur
            category = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                reason: 'Log kanalları için kategori oluşturuldu'
            });
            console.log('Kategori oluşturuldu: Sunucu Log');

            // Kanalları oluştur ve kategoriye taşı
            for (const channelName of channels) {
                // Kanal var mı kontrol et
                const existingChannel = guild.channels.cache.find(c => c.name === channelName);
                if (existingChannel) {
                    await existingChannel.delete('Eski kanal silindi');
                    console.log(`Kanal silindi: ${channelName}`);
                }

                await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText, // Discord.js v14'te metin kanalı türü
                    parent: category.id, // Kategoriye taşı
                    reason: 'Log kanalı olarak oluşturuldu'
                });
                console.log(`Kanal oluşturuldu: ${channelName}`);
            }

            // Başarı mesajı
            message.reply('Log kanalları ve kategori başarıyla oluşturuldu! /logs-set komutu ile ayarlamalara başlayabilirsin!');
        } catch (error) {
            console.error('Log kanalları oluşturulurken bir hata oluştu:', error);
            message.reply('Log kanalları oluşturulurken bir hata oluştu. Konsolu Kontrol Ediniz');
        }
    },
};
