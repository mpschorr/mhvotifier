import * as net from 'net';
import * as events from 'events';

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
        socket.once('data', (bData) => {
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
