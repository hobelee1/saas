const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  slash: true,
  enable: true,
  name: ['beyazliste'],
  description: 'Bot beyaz listedeki kullanıcıların işlemlerini engellemez.', 
  options: [
      {
        name: "ekle",
        description: "Beyaz listeye kullanıcı ekler.",
        type: 1,
        options: [
        {
            name: "member",
            description: "Beyaz listeye alınacak kullanıcı.",
            type: 6,
            required: true
          }
        ]
      },
      {
        name: "çıkar",
        description: "Beyaz listeden kullanıcı çıkarır.",
        type: 1,
        options: [
        {
            name: "member",
            description: "Beyaz listeden çıkarılacak kullanıcı.",
            type: 6,
            required: true
          }
        ]
      },
    ],
  async execute(client, interaction, db) {
    if(interaction.member.id !== interaction.guild.ownerId) return interaction.reply("Bu komudu sadece sunucu sahibi kullanabilir.");
    const user = interaction.options.getUser("member");
    const data = db.get(`verify_${interaction.guild.id}`)?.includes(user.id);
    if(interaction.options.getSubcommand() === "ekle") {
      if(data) return interaction.reply(`<@${user.id}> zaten beyaz listede.`);
      db.push(`verify_${interaction.guild.id}`, user.id);
      interaction.reply(`<@${user.id}> beyaz listeye alındı.`);
    } else {
      if(!data) return interaction.reply(`<@${user.id}> zaten beyaz listede değil.`);
      db.pull(`verify_${interaction.guild.id}`, user.id);
      interaction.reply(`<@${user.id}> beyaz listeden çıkarıldı.`);
    }
  },
};