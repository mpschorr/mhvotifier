"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotifierServer = void 0;
const net = __importStar(require("net"));
const events = __importStar(require("events"));
const logger_1 = require("../logger");
class VotifierServer extends events.EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.handleConnection = this.handleConnection.bind(this);
        this.server = net.createServer();
        this.server.on('connection', this.handleConnection);
        this.server.listen(port);
    }
    handleConnection(socket) {
        socket.setTimeout(5000);
        logger_1.votifierLogger.debug('New connection');
        socket.write('VOTIFIER 1.9');
        socket.on('close', (hadError) => {
            logger_1.votifierLogger.debug('Socket closed ' + (hadError ? 'with error' : 'without error'));
        });
        socket.on('connect', () => {
            logger_1.votifierLogger.debug('Socket connected');
        });
        socket.on('drain', () => {
            logger_1.votifierLogger.debug('Socket drained');
        });
        socket.on('end', () => {
            logger_1.votifierLogger.debug('Socket ended');
        });
        socket.on('error', (error) => {
            logger_1.votifierLogger.debug('Socket error ' + error);
        });
        socket.on('lookup', (error, address, family, host) => {
            logger_1.votifierLogger.debug('Socket lookup ' + error + address + ' ' + family + ' ' + host);
        });
        socket.on('ready', () => {
            logger_1.votifierLogger.debug('Socket ready');
        });
        socket.on('timeout', () => {
            logger_1.votifierLogger.debug('Socket timeout');
        });
        socket.on('data', (bData) => {
            logger_1.votifierLogger.debug('Received data');
            logger_1.votifierLogger.debug(bData.toString());
            socket.write('VOTIFIER 1.9');
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
exports.VotifierServer = VotifierServer;
//# sourceMappingURL=server.js.map