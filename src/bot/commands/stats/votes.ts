/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { Servers } from '../../../db';
import { botLogger as logger } from '../../../logger';
import { EmbedUtil } from '../../embed';

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'votes',
            description: 'Get how many votes a server has',
        });
    }

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        command.addStringOption(new SlashCommandStringOption().setName('name').setDescription('The name of the server').setRequired(true));

        logger.info(`Registering command /${this.name}`);

        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD!],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        const name = interaction.options.getString('name');
        if (!name) return;

        const server = await Servers.getByName(name);

        if (!server) {
            return interaction.reply({
                embeds: [EmbedUtil.error('Server not found!')],
                ephemeral: true,
            });
        }

        interaction.reply({
            embeds: [EmbedUtil.neutral('Votes', `**${server.name}** has ${server.votes} votes`)],
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
