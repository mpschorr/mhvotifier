import { Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import config from '../config.json';

export class JoinListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildMemberAdd',
        });
    }

    public async run(guildMember: GuildMember) {
        guildMember.roles.add(config.member.role)
    }
}
