/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { botLogger as logger } from '../../../logger';
import { ServerMap } from '../../../server';

import { EmbedUtil } from '../../embed';

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'test',
            description: 'Test command (ADMIN ONLY)',
        });
    }

    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        command.addStringOption(new SlashCommandStringOption().setName('value').setDescription('Test value').setRequired(true));

        logger.info(`Registering command /${this.name}`);

        registry.registerChatInputCommand(command, {
            guildIds: [process.env.BOT_GUILD!],
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has('ADMINISTRATOR')) {
            return interaction.reply({
                embeds: [EmbedUtil.permission('ADMINISTRATOR')],
                ephemeral: true,
            });
        }

        const value = interaction.options.getString('value')!;

        ServerMap.sendVote(value, {
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
