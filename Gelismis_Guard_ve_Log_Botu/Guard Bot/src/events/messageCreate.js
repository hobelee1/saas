const { prefix, topgg } = require("../../settings.json");

module.exports = {
    name: "messageCreate",
    async execute(message, client, dbl, db) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Komutları yükle
        let command = client.commands.get(commandName);
        if (!command) {
            console.log(`Komut bulunamadı: ${commandName}`);
            return;
        }

        console.log(`Komut çalıştırılıyor: ${commandName}`);

        // Top.gg oy kontrolü
        if (topgg) {
            try {
                const votes = await dbl.getVotes();
                if (command.dbl && !votes.find(vote => vote.id === message.author.id)) {
                    return message.reply("Bu komutu kullanmak için bota oy vermeniz gerekiyor.");
                }
            } catch (error) {
                console.error("Top.gg oy verileri alınırken bir hata oluştu:", error);
            }
        }

        // Komutu çalıştır
        try {
            await command.execute(message, args, client, dbl, db);
        } catch (error) {
            console.error(error);
            message.reply('Bir hata oluştu.');
        }
    },
};
