/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';
import { botLogger as logger } from '../../../logger';

export class Ping extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'ping',
            description: 'Pong!',
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
        const then = Date.now();
        await interaction.reply({
            content: 'Pinging...',
            ephemeral: true,
        });

        interaction.editReply({
            content: `:ping_pong: **Pong!**\n\nBot ping: ${Date.now() - then}ms\nWebsocket ping: ${interaction.client.ws.ping}ms`,
        });
    }
}
