"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyListener = void 0;
const framework_1 = require("@sapphire/framework");
const logger_1 = require("../../logger");
class ReadyListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'ready',
        });
    }
    async run(client) {
        if (!client.isReady())
            return;
        logger_1.botLogger.info(`Logged in as ${client.user.tag}!`);
    }
}
exports.ReadyListener = ReadyListener;
//# sourceMappingURL=ready.js.map