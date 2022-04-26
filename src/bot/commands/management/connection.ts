/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { Servers } from '../../../db';
import { botLogger as logger } from '../../../logger';
import { EmbedUtil } from '../../embed';

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'connection',
            description: 'Gets connection information for your server',
        });
    }

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        logger.info(`Registering command /${this.name}`);

        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD!],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        const server = await Servers.get({
            owner: interaction.member!.user.id,
        });

        if (!server) {
            return interaction.reply({
                embeds: [EmbedUtil.error('You do not have a server! Use `/create` to create one.')],
                ephemeral: true,
            });
        }

        const embed = EmbedUtil.neutral(
            'Connection Information',
            '**WARNING!**\nDo not share this information with anybody!\nThis information can allow people to impersonate you.',
        )
            .addField('Name', `\`${server.name}\`` ?? 'None! Please contact an administrator.')
            .addField('Password', `\`${server.password}\`` ?? 'None! Please contact an administrator.');

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
