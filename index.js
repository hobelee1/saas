const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { token, prefix, topgg } = require("./settings.json");
const DBL = require("dblapi.js");

// Yeni bir Client nesnesi oluştur
const client = new Client({
    intents: Object.values(GatewayIntentBits).filter(x => typeof x === "string"),
    partials: [Object.values(Partials).filter(x => typeof x === "string")]
});

// Prefix'i client nesnesine ekle
client.prefix = prefix;

let dbl;
if (topgg) {
    dbl = new DBL(topgg, { webhookPort: 5000, webhookAuth: 'password' });
}

// Komutlar ve olayları yükle
require("./src/base/app.js")(client, dbl);

// Botu başlat
client.login(token);

// Hata yönetimi
process.on("uncaughtException", _ => {});
process.on("unhandledRejection", _ => {});
