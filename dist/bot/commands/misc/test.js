"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const logger_1 = require("../../../logger");
const server_1 = require("../../../server");
const embed_1 = require("../../embed");
class Ping extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'test',
            description: 'Test command (ADMIN ONLY)',
        });
    }
    registerApplicationCommands(registry) {
        const command = new builders_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
        command.addStringOption(new builders_1.SlashCommandStringOption().setName('value').setDescription('Test value').setRequired(true));
        logger_1.botLogger.info(`Registering command /${this.name}`);
        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */,
        });
    }
    async chatInputRun(interaction) {
        var _a;
        if (!((_a = interaction.memberPermissions) === null || _a === void 0 ? void 0 : _a.has('ADMINISTRATOR'))) {
            return interaction.reply({
                embeds: [embed_1.EmbedUtil.permission('ADMINISTRATOR')],
                ephemeral: true,
            });
        }
        const value = interaction.options.getString('value');
        server_1.ServerMap.sendVote(value, {
            user: 'jeelzzz',
            service: 'MHVotifier (1.0)',
            ip: '192.168.1.1',
        });
        interaction.reply({
            content: `Sent a vote to ${value}`,
            ephemeral: true,
        });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=test.js.map