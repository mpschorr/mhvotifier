"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ping = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const builders_1 = require("@discordjs/builders");
const framework_1 = require("@sapphire/framework");
const db_1 = require("../../../db");
const logger_1 = require("../../../logger");
const embed_1 = require("../../embed");
const PAGE_SIZE = 10;
class Ping extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'votetop',
            description: 'Get the top voted servers',
        });
    }
    registerApplicationCommands(registry) {
        const command = new builders_1.SlashCommandBuilder().setName(this.name).setDescription(this.description);
        command.addIntegerOption(new builders_1.SlashCommandIntegerOption().setName('page').setDescription('Page number to show').setRequired(false));
        logger_1.botLogger.info(`Registering command /${this.name}`);
        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD],
            behaviorWhenNotIdentical: "OVERWRITE" /* Overwrite */,
        });
    }
    async chatInputRun(interaction) {
        var _a;
        logger_1.botLogger.debug('Ran');
        const count = await db_1.Servers.count();
        const maxPage = Math.ceil(count / 10);
        let page = (_a = interaction.options.getInteger('page')) !== null && _a !== void 0 ? _a : 1;
        if (page < 1)
            page = 1;
        if (page > maxPage)
            page = maxPage;
        logger_1.botLogger.debug(`Ran ${page}/${maxPage}`);
        const min = (page - 1) * PAGE_SIZE;
        const max = page * PAGE_SIZE;
        const servers = await db_1.Servers.getSorted(min, max);
        let length = 0;
        servers.forEach((server) => { var _a, _b; return (length = Math.max(length, (_b = (_a = server.name) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0)); });
        let str = '```';
        servers.forEach((server) => {
            var _a, _b;
            const pad = ' '.repeat(1 + length - ((_b = (_a = server.name) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0));
            str += `${server.name}${pad}| ${server.votes}\n`;
        });
        str += '```';
        return interaction.reply({
            embeds: [
                embed_1.EmbedUtil.neutral('Top Votes', str).setAuthor({
                    name: `Page ${page}/${maxPage}`,
                }),
            ],
            ephemeral: true,
        });
        // const server = await Servers.getByName(name);
        // if (!server) {
        //     return interaction.reply({
        //         embeds: [EmbedUtil.error('Server not found!')],
        //         ephemeral: true,
        //     });
        // }
        // interaction.reply({
        //     embeds: [EmbedUtil.neutral('Votes', `**${server.name}** has ${server.votes} votes`)],
        //     ephemeral: true,
        // });
    }
}
exports.Ping = Ping;
//# sourceMappingURL=votetop.js.map