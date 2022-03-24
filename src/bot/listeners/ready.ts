import { Listener } from '@sapphire/framework';
import { Client } from 'discord.js';
import { botLogger as logger } from '../../logger';

export class ReadyListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'ready',
        });
    }

    public async run(client: Client) {
        if (!client.isReady()) return;

        logger.info(`Logged in as ${client.user.tag}!`);
    }
}
