import { createServer, IncomingMessage } from 'http';
import ws, { Server } from 'ws';
import { IncomingSocketMessage, OutgoingSocketMessage } from './types';

import { socketLogger as logger } from '../logger';
import { ServerMap } from '../server';
import { Servers } from '../db';

const server = createServer();
const wss = new Server({ server });

wss.on('connection', async (socket: ws, req: IncomingMessage) => {
    const servername = (req.headers['auth-server'] ?? '') as string;
    const serverkey = (req.headers['auth-key'] ?? '') as string;

    const server = Servers.get({
        name: servername,
        key: serverkey,
    });

    if (!server) {
        socket.send(
            JSON.stringify({
                name: 'ERROR',
                data: {
                    message: 'Invalid credentials! Make sure your server name and key are correct.',
                    code: 1,
                },
            } as OutgoingSocketMessage),
        );

        return socket.close();
    }

    ServerMap.add(servername, socket);
    logger.info(`${servername} connected`);

    socket.on('message', (rawData) => {
        try {
            const data = JSON.parse(rawData.toString());

            const message = data as IncomingSocketMessage;

            if (message.name == 'PLAYERCOUNT UPDATE') {
                ServerMap.updatePlayers(servername, message.data.playercount);
                logger.debug(`Updated player count for ${servername} to ${message.data.playercount}`);
            } else if (message.name == 'VOTE ACKNOWLEDGEMENT') {
                if (!ServerMap.has(servername)) return;

                logger.info(`Vote acknowledged for ${message.data.user} on ${servername}`);

                Servers.addVote({
                    name: servername,
                });
            }
        } catch {
            logger.error(`${servername} sent invalid JSON: ${rawData}`);

            socket.send(
                JSON.stringify({
                    name: 'ERROR',
                    data: {
                        message: 'Invalid JSON! what the hell are you doing',
                        code: 2,
                    },
                } as OutgoingSocketMessage),
            );

            return socket.close();
        }
    });

    socket.on('close', () => {
        logger.info(`${servername} disconnected`);
        return ServerMap.remove(servername);
    });
});

server.listen(process.env.SOCKET_PORT);

server.on('listening', () => {
    logger.info(`Listening on port ${process.env.SOCKET_PORT}`);
});
