"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMap = void 0;
class ServerMap {
    static add(name, socket) {
        this.servers.set(name, {
            name,
            socket,
            players: 0,
        });
    }
    static remove(name) {
        var _a, _b;
        if (!this.servers.has(name))
            return;
        (_b = (_a = this.servers.get(name)) === null || _a === void 0 ? void 0 : _a.socket) === null || _b === void 0 ? void 0 : _b.close();
        this.servers.delete(name);
    }
    static has(name) {
        return this.servers.has(name);
    }
    static get(name) {
        return this.servers.get(name);
    }
    static getSorted() {
        return Array.from(this.servers.values()).sort((a, b) => b.players - a.players);
    }
    static updatePlayers(name, players) {
        if (!this.servers.has(name))
            return;
        const server = this.get(name);
        server.players = players;
        this.servers.set(name, server);
    }
    static sendVote(name, vote) {
        var _a;
        if (!this.servers.has(name))
            return;
        const server = this.servers.get(name);
        (_a = server.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            name: 'VOTE',
            data: {
                user: vote.user,
                service: vote.service,
                ip: vote.ip,
            },
        }));
    }
}
exports.ServerMap = ServerMap;
ServerMap.servers = new Map();
//# sourceMappingURL=server.js.map