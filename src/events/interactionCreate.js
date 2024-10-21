const { InteractionType } = require("discord.js");
const { topgg } = require("../../settings.json");

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, dbl, db) {
	  if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashcommands.get(interaction.commandName);
      if (!command) return;
      try {
        if(topgg) {
          await dbl.getVotes().then(x => { 
            if(command.dbl && !x.filter(y => y.id === interaction.user.id).length) return interaction.reply("Bu komutu kullanmak için bota oy vermeniz gerekiyor.")
            else command.execute(client, interaction, db, dbl);
          })
        } else {
          await command.execute(client, interaction, db, dbl);
        }
      } catch (error) {
        console.error(error);
        interaction.reply({ content: 'Komutta bir sorun oluştu lütfen daha sonra tekrar dene 😔', ephemeral: true }).catch(err => {});
      }
	  }
	},
};
