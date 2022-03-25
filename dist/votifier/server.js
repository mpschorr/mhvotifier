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
        socket.on('error', (error) => {
            logger_1.votifierLogger.debug('Socket error ' + error);
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
exports.VotifierServer = VotifierServer;
//# sourceMappingURL=server.js.map