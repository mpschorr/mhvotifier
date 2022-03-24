/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WebSocket } from 'ws';
import { OutgoingSocketMessage } from './socket/types';
import { Vote } from './votifier/types';

export interface ConnectedServer {
    name: string;
    players: number;
    socket: WebSocket | null;
}

export class ServerMap {
    private static servers: Map<string, ConnectedServer> = new Map();

    public static add(name: string, socket: WebSocket | null) {
        this.servers.set(name, {
            name,
            socket,
            players: 0,
        });
    }

    public static remove(name: string) {
        if (!this.servers.has(name)) return;

        this.servers.get(name)?.socket?.close();
        this.servers.delete(name);
    }

    public static has(name: string): boolean {
        return this.servers.has(name);
    }

    public static get(name: string): ConnectedServer | undefined {
        return this.servers.get(name);
    }

    public static getSorted(): ConnectedServer[] {
        return Array.from(this.servers.values()).sort((a, b) => b.players - a.players);
    }

    public static updatePlayers(name: string, players: number) {
        if (!this.servers.has(name)) return;
        const server = this.get(name)!;

        server.players = players;
        this.servers.set(name, server);
    }

    public static sendVote(name: string, vote: Vote) {
        if (!this.servers.has(name)) return;

        const server = this.servers.get(name)!;

        server.socket?.send(
            JSON.stringify({
                name: 'VOTE',
                data: {
                    user: vote.user,
                    service: vote.service,
                    ip: vote.ip,
                },
            } as OutgoingSocketMessage),
        );
    }
}
