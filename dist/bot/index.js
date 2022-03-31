"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const client = new framework_1.SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
    baseUserDirectory: __dirname,
    logger: {
        level: 100 /* None */,
    },
});
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=index.js.map