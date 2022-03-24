"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const logger_1 = require("../../../logger");
class Ping extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ping',
            description: 'Pong!',
        });
    }
    registerApplicationCommands(registry) {
        const command = new builders_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
        logger_1.botLogger.info(`Registering command /${this.name}`);
        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */,
        });
    }
    async chatInputRun(interaction) {
        const then = Date.now();
        await interaction.reply({
            content: 'Pinging...',
            ephemeral: true,
        });
        interaction.editReply({
            content: `:ping_pong: **Pong!**\n\nBot ping: ${Date.now() - then}ms\nWebsocket ping: ${interaction.client.ws.ping}ms`,
        });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=ping.js.map