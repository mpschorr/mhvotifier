/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { Servers } from '../../../db';
import { botLogger as logger, publishlog } from '../../../logger';
import { EmbedUtil } from '../../embed';

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'create',
            description: 'Creates a server',
        });
    }

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        command.addStringOption(new SlashCommandStringOption().setName('name').setDescription('The name of the server to create').setRequired(true));

        logger.info(`Registering command /${this.name}`);

        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD!],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        let server = await Servers.get({
            owner: interaction.member!.user.id,
        });

        if (server) {
            return interaction.reply({
                embeds: [EmbedUtil.error('You already have a server!')],
                ephemeral: true,
            });
        }

        const name = interaction.options.getString('name')!;

        server = await Servers.get({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        });

        if (server) {
            return interaction.reply({
                embeds: [EmbedUtil.error('A server with that name already exists! Please choose a different one.')],
                ephemeral: true,
            });
        }

        Servers.create(name, interaction.member!.user.id);

        const embed = EmbedUtil.success('Created your server!');

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });

        publishlog('creations', 'create', `${interaction.member?.user.username} created a server named ${name}`);
    }
}
