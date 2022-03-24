"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVotifier = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const server_1 = require("./server");
const logger_1 = require("../logger");
const server_2 = require("../server");
const db_1 = require("../db");
const crypto_1 = require("crypto");
let server;
function setupVotifier() {
    server = new server_1.VotifierServer(parseInt(process.env.VOTIFIER_PORT));
    server.on('data', async (bdata) => {
        for (const server of server_2.ServerMap.getSorted()) {
            const dbserver = await db_1.Servers.get({
                name: server.name,
            });
            if (!dbserver)
                continue;
            if (!dbserver.rsa)
                continue;
            if (!dbserver.rsa.private)
                continue;
            const privateKey = (0, crypto_1.createPrivateKey)(dbserver.rsa.private);
            const decoded = (0, crypto_1.privateDecrypt)({
                key: privateKey,
                padding: crypto_1.constants.RSA_PKCS1_PADDING,
            }, bdata);
            const sdata = decoded.toString();
            logger_1.votifierLogger.debug(`Trying to decode server ${server.name}`);
            if (!sdata.startsWith('VOTE'))
                continue;
            const data = sdata.split('\n');
            const vote = {
                user: data[2],
                service: data[1],
                ip: data[3],
            };
            logger_1.votifierLogger.info(`Vote decoded for ${server.name}`);
            const connected = server_2.ServerMap.get(server.name);
            if (!connected)
                return;
            if (!connected.socket)
                return;
            connected.socket.send(JSON.stringify({
                name: 'VOTE',
                data: vote,
            }));
            return;
        }
    });
    server.on('error', (error) => {
        logger_1.votifierLogger.error('Error: ' + error);
    });
    logger_1.votifierLogger.info(`Votifier server listening on port ${process.env.VOTIFIER_PORT}`);
}
exports.setupVotifier = setupVotifier;
//# sourceMappingURL=index.js.map