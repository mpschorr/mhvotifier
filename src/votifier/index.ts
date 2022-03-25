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

            let privateKey;
            let decoded;
            let sdata = '';

            try {
                privateKey = createPrivateKey(dbserver.rsa.private);
                decoded = privateDecrypt(
                    {
                        key: privateKey,
                        padding: constants.RSA_PKCS1_PADDING,
                    },
                    bdata,
                );
                sdata = decoded.toString();
            } catch (error) {
                const connected = ServerMap.get(server.name);
                if (!connected) return;
                if (!connected.socket) return;
                connected.socket.send(
                    JSON.stringify({
                        name: 'ERROR',
                        data: {
                            message: 'Decryption error',
                            code: 3,
                        },
                    } as OutgoingSocketMessage),
                );
                connected.socket.close();
                // logger.error(error);
            }

            logger.debug(`Trying to decode server ${server.name}`);
            if (!sdata.startsWith('VOTE')) continue;

            const data = sdata.split('\n');
            if (data.length !== 6) continue;

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

    server.on('error', (error) => {
        logger.error('Error: ' + error);
    });

    logger.info(`Votifier server listening on port ${process.env.VOTIFIER_PORT}`);
}
