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
            name: 'create',
            description: 'Creates a server',
        });
    }
    registerApplicationCommands(registry) {
        const command = new builders_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
        command.addStringOption(new builders_1.SlashCommandStringOption().setName('name').setDescription('The name of the server to create').setRequired(true));
        logger_1.botLogger.info(`Registering command /${this.name}`);
        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */,
        });
    }
    async chatInputRun(interaction) {
        var _a;
        let server = await db_1.Servers.get({
            owner: interaction.member.user.id,
        });
        if (server) {
            return interaction.reply({
                embeds: [embed_1.EmbedUtil.error('You already have a server!')],
                ephemeral: true,
            });
        }
        const name = interaction.options.getString('name');
        server = await db_1.Servers.getByName(name);
        if (server) {
            return interaction.reply({
                embeds: [embed_1.EmbedUtil.error('A server with that name already exists! Please choose a different one.')],
                ephemeral: true,
            });
        }
        db_1.Servers.create(name, interaction.member.user.id);
        const embed = embed_1.EmbedUtil.success('Created your server!');
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
        (0, logger_1.publishlog)('creations', 'create', `${(_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.username} created a server named ${name}`);
    }
}
exports.Ping = Ping;
//# sourceMappingURL=create.js.map