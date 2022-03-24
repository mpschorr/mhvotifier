/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VotifierServer } from './server';

import { votifierLogger as logger } from '../logger';
import { ServerMap } from '../server';
import { Servers } from '../db';
import { createPrivateKey, privateDecrypt, constants } from 'crypto';
import { Vote } from './types';
import { OutgoingSocketMessage } from '../socket/types';

let server: VotifierServer;

export function setupVotifier() {
    server = new VotifierServer(parseInt(process.env.VOTIFIER_PORT!));

    server.on('data', async (bdata) => {
        for (const server of ServerMap.getSorted()) {
            const dbserver = await Servers.get({
                name: server.name,
            });

            if (!dbserver) continue;
            if (!dbserver.rsa) continue;
            if (!dbserver.rsa.private) continue;

            const privateKey = createPrivateKey(dbserver.rsa.private);
            const decoded = privateDecrypt(
                {
                    key: privateKey,
                    padding: constants.RSA_PKCS1_PADDING,
                },
                bdata,
            );

            const sdata = decoded.toString();
            logger.debug(`Trying to decode server ${server.name}`);
            if (!sdata.startsWith('VOTE')) continue;

            const data = sdata.split('\n');
            const vote = {
                user: data[2],
                service: data[1],
                ip: data[3],
            } as Vote;

            logger.info(`Vote decoded for ${server.name}`);

            const connected = ServerMap.get(server.name);

            if (!connected) return;
            if (!connected.socket) return;

            connected.socket.send(
                JSON.stringify({
                    name: 'VOTE',
                    data: vote,
                } as OutgoingSocketMessage),
            );

            return;
        }
    });

    logger.info(`Votifier server listening on port ${process.env.VOTIFIER_PORT}`);
}
