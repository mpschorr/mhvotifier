"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const db_1 = require("../../../db");
const logger_1 = require("../../../logger");
const embed_1 = require("../../embed");
class Ping extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'votes',
            description: 'Get how many votes a server has',
        });
    }
    registerApplicationCommands(registry) {
        const command = new builders_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
        command.addStringOption(new builders_1.SlashCommandStringOption().setName('name').setDescription('The name of the server').setRequired(true));
        logger_1.botLogger.info(`Registering command /${this.name}`);
        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */,
        });
    }
    async chatInputRun(interaction) {
        const name = interaction.options.getString('name');
        if (!name)
            return;
        const server = await db_1.Servers.getByName(name);
        if (!server) {
            return interaction.reply({
                embeds: [embed_1.EmbedUtil.error('Server not found!')],
                ephemeral: true,
            });
        }
        interaction.reply({
            embeds: [embed_1.EmbedUtil.neutral('Votes', `**${server.name}** has ${server.votes} votes`)],
            ephemeral: true,
        });
        // const then = Date.now();
        // await interaction.reply({
        //     content: 'Pinging...',
        //     ephemeral: true,
        // });
        // interaction.editReply({
        //     content: `:ping_pong: **Pong!**\n\nBot ping: ${Date.now() - then}ms\nWebsocket ping: ${interaction.client.ws.ping}ms`,
        // });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=votes.js.map