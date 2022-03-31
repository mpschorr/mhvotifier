"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = require("ws");
const logger_1 = require("../logger");
const server_1 = require("../server");
const db_1 = require("../db");
const server = (0, http_1.createServer)();
const wss = new ws_1.Server({ server });
wss.on('connection', async (socket, req) => {
    var _a, _b;
    const servername = ((_a = req.headers['auth-server']) !== null && _a !== void 0 ? _a : '');
    const serverpass = ((_b = req.headers['auth-password']) !== null && _b !== void 0 ? _b : '');
    const server = db_1.Servers.get({
        name: servername,
        key: serverpass,
    });
    if (!server) {
        socket.send(JSON.stringify({
            name: 'ERROR',
            data: {
                message: 'Invalid credentials! Make sure your server name and key are correct.',
                code: 1,
            },
        }));
        return socket.close();
    }
    server_1.ServerMap.add(servername, socket);
    logger_1.socketLogger.info(`${servername} connected`);
    socket.on('message', (rawData) => {
        try {
            const data = JSON.parse(rawData.toString());
            const message = data;
            if (message.name == 'PLAYERCOUNT UPDATE') {
                server_1.ServerMap.updatePlayers(servername, message.data.playercount);
                logger_1.socketLogger.debug(`Updated player count for ${servername} to ${message.data.playercount}`);
            }
            else if (message.name == 'VOTE ACKNOWLEDGEMENT') {
                if (!server_1.ServerMap.has(servername))
                    return;
                logger_1.socketLogger.info(`Vote acknowledged for ${message.data.user} on ${servername}`);
                db_1.Servers.addVote({
                    name: servername,
                });
            }
        }
        catch (_a) {
            logger_1.socketLogger.error(`${servername} sent invalid JSON: ${rawData}`);
            socket.send(JSON.stringify({
                name: 'ERROR',
                data: {
                    message: 'Invalid JSON! what the hell are you doing',
                    code: 2,
                },
            }));
            return socket.close();
        }
    });
    socket.on('close', () => {
        logger_1.socketLogger.info(`${servername} disconnected`);
        return server_1.ServerMap.remove(servername);
    });
});
server.listen(process.env.SOCKET_PORT);
server.on('listening', () => {
    logger_1.socketLogger.info(`Listening on port ${process.env.SOCKET_PORT}`);
});
//# sourceMappingURL=index.js.map