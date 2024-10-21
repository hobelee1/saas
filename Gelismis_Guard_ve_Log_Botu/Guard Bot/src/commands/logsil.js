const { ChannelType } = require('discord.js'); // Discord.js v14 için

module.exports = {
    name: 'logsil',
    description: 'Log kanallarını ve kategoriyi siler.',
    enable: true,
    async execute(message, args, client) {
        console.log('Logsil komutu çalıştı!');
        
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
                categoryChannels.forEach(async channel => {
                    await channel.delete('Eski kanal silindi');
                    console.log(`Kanal silindi: ${channel.name}`);
                });

                // Kategoriyi sil
                await category.delete('Eski kategori silindi');
                console.log('Kategori silindi: Sunucu Log');
            } else {
                // Kategori bulunamazsa yine de kanalları kontrol edip silmek için devam edelim
                for (const channelName of channels) {
                    const existingChannel = guild.channels.cache.find(c => c.name === channelName);
                    if (existingChannel) {
                        await existingChannel.delete('Eski kanal silindi');
                        console.log(`Kanal silindi: ${channelName}`);
                    }
                }
            }

            // Başarı mesajı
            message.reply('Log kanalları ve kategori başarıyla silindi!');
        } catch (error) {
            console.error('Log kanalları silinirken bir hata oluştu:', error);
            message.reply('Log kanalları silinirken bir hata oluştu. Konsolu Kontrol Ediniz');
        }
    },
};
