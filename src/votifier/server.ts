import * as net from 'net';
import * as events from 'events';

import { votifierLogger as logger } from '../logger';

export declare interface VotifierServer {
    port: number;
    server: net.Server;
    self: VotifierServer;

    handleConnection(socket: net.Socket): void;

    on(event: 'error', listener: (error: string) => void): this;
    on(event: 'data', listener: (data: Buffer) => void): this;
}

export class VotifierServer extends events.EventEmitter {
    public constructor(port: number) {
        super();

        this.port = port;

        this.handleConnection = this.handleConnection.bind(this);

        this.server = net.createServer();
        this.server.on('connection', this.handleConnection);
        this.server.listen(port);
    }

    public handleConnection(socket: net.Socket) {
        logger.debug('New connection');

        socket.on('close', (hadError) => {
            logger.debug('Socket closed ' + (hadError ? 'with error' : 'without error'));
        });

        socket.on('connect', () => {
            logger.debug('Socket connected');
        });

        socket.on('drain', () => {
            logger.debug('Socket drained');
        });

        socket.on('end', () => {
            logger.debug('Socket ended');
        });

        socket.on('error', (error: Error) => {
            logger.debug('Socket error ' + error);
        });

        socket.on('lookup', (error: Error, address: string, family: string | number, host: string) => {
            logger.debug('Socket lookup ' + error + address + ' ' + family + ' ' + host);
        });

        socket.on('ready', () => {
            logger.debug('Socket ready');
        });

        socket.on('timeout', () => {
            logger.debug('Socket timeout');
        });

        socket.on('data', (bData) => {
            logger.debug('Received data');
            logger.debug(bData.toString());

            socket.write('VOTIFIER MHVOTIFIER');

            if (bData.length !== 256) {
                socket.end('Bad data length');
                socket.destroy();
                this.emit('error', 'Bad data length');
                return;
            }

            this.emit('data', bData);
            return socket.destroy();
        });
    }
}
