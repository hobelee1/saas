const commands = [];
const fs = require("node:fs");
const path = require("node:path");
const { REST } = require('@discordjs/rest');
const { Collection } = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const eventsPath = path.join(__dirname, "../events");
const { botid, token, prefix } = require("../../settings.json");
const commandsPath = path.join(__dirname, "../commands");
const db = require("inflames.db").sqlite();
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

module.exports = (client, dbl) => {
    client.commands = new Collection();
    client.slashcommands = new Collection();

    // Event dosyalarını yükle
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, dbl, db));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, dbl, db));
        }
    }

    // Komut dosyalarını yükle
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.enable !== false) {
            if (command.slash) {
                client.slashcommands.set(command.name[0], command);
                const slashCommand = {
                    "name": command.name[0],
                    "type": 1,
                    "description": command.description ?? "",
                    "default_member_permissions": command.permission,
                    "options": command.options ? [...command.options] : []
                };
                commands.push(slashCommand);
            } else {
                // Prefix komutları
                if (Array.isArray(command.name)) {
                    for (const name of command.name) {
                        client.commands.set(name, command);
                    }
                } else {
                    client.commands.set(command.name, command);
                }
            }
        }
    }

    // Slash komutlarını Discord API'sine kaydet
    setTimeout(async () => {
        try {
            await new REST({ version: '9' }).setToken(token).put(Routes.applicationCommands(botid), { body: commands });
        } catch (error) {
            console.error(error);
        }
    }, 500);

    // Mesaj komutlarını işlemek için olay
    client.on('messageCreate', async message => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        let commandName = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
        let args = message.content.slice(prefix.length).trim().split(/ +/).slice(1);
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
            await command.execute(message, args, client, dbl, db, prefix); // Prefix'i parametre olarak geçiriyoruz
        } catch (error) {
            console.error(error);
            message.reply('Bir hata oluştu.');
        }
    });
};
