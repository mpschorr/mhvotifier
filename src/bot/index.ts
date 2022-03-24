import { LogLevel, SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    baseUserDirectory: __dirname,
    logger: {
        level: LogLevel.None,
    },
});

client.login(process.env.BOT_TOKEN);
