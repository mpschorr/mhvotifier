/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder, SlashCommandIntegerOption } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { Servers } from '../../../db';
import { botLogger as logger } from '../../../logger';
import { EmbedUtil } from '../../embed';

const PAGE_SIZE = 10;

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'votetop',
            description: 'Get the top voted servers',
        });
    }

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        command.addIntegerOption(new SlashCommandIntegerOption().setName('page').setDescription('Page number to show').setRequired(false));

        logger.info(`Registering command /${this.name}`);

        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD!],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        logger.debug('Ran');
        const count = await Servers.count();
        const maxPage = Math.ceil(count / 10);

        let page = interaction.options.getInteger('page') ?? 1;
        if (page < 1) page = 1;
        if (page > maxPage) page = maxPage;

        logger.debug(`Ran ${page}/${maxPage}`);

        const min = (page - 1) * PAGE_SIZE;
        const max = page * PAGE_SIZE;
        const servers = await Servers.getSorted(min, max);

        let length = 0;
        servers.forEach((server) => (length = Math.max(length, server.name?.length ?? 0)));

        let str = '```';
        servers.forEach((server) => {
            const pad = ' '.repeat(1 + length - (server.name?.length ?? 0));
            str += `${server.name}${pad}| ${server.votes}\n`;
        });
        str += '```';

        return interaction.reply({
            embeds: [
                EmbedUtil.neutral('Top Votes', str).setAuthor({
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
