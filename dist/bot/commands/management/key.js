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
            name: 'key',
            description: 'Gets the Votifier key for your server',
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
        var _a;
        const server = await db_1.Servers.get({
            owner: interaction.member.user.id,
        });
        if (!server) {
            return interaction.reply({
                embeds: [embed_1.EmbedUtil.error('You do not have a server! Use `/create` to create one.')],
                ephemeral: true,
            });
        }
        const key = (_a = server.rsa.public) === null || _a === void 0 ? void 0 : _a.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');
        const embed = embed_1.EmbedUtil.neutral('Votifier Keys', '**WARNING!**\nDo not share this information with anybody!\nThis information can allow people to fake votes.').addField('Key', `\`\`\`${key}\`\`\``);
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=key.js.map