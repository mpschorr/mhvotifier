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
        socket.setTimeout(5000);

        socket.write('VOTIFIER 1.9');

        socket.on('error', (error: Error) => {
            logger.debug('Socket error ' + error);
        });

        socket.on('timeout', () => {
            socket.end();
            socket.destroy();
        });

        socket.on('data', (bData) => {
            socket.write('VOTIFIER 1.9');

            if (bData.length !== 256) {
                socket.end('Bad data length');
                socket.destroy();
                this.emit('error', 'Bad data length');
                return;
            }

            this.emit('data', bData);
            socket.end();
            socket.destroy();
        });
    }
}
