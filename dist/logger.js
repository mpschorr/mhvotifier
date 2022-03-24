"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishlog = exports.setupLogger = exports.votifierLogger = exports.dbLogger = exports.socketLogger = exports.botLogger = exports.logsnag = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const log4js_1 = require("log4js");
const logsnag_1 = require("logsnag");
function setupLogger() {
    (0, log4js_1.configure)({
        appenders: {
            console: {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '%d{MM/dd/yyyy hh:mm:ss.SSS} %[[%c - %p] %m%]',
                },
            },
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'debug',
            },
            BOT: {
                appenders: ['console'],
                level: 'debug',
            },
            SOCKET: {
                appenders: ['console'],
                level: 'debug',
            },
            DB: {
                appenders: ['console'],
                level: 'debug',
            },
            VOTIFIER: {
                appenders: ['console'],
                level: 'debug',
            },
        },
    });
    exports.botLogger = (0, log4js_1.getLogger)('BOT');
    exports.socketLogger = (0, log4js_1.getLogger)('SOCKET');
    exports.dbLogger = (0, log4js_1.getLogger)('DB');
    exports.votifierLogger = (0, log4js_1.getLogger)('VOTIFIER');
    exports.logsnag = new logsnag_1.LogSnag(process.env.LOGSNAG_TOKEN);
}
exports.setupLogger = setupLogger;
function publishlog(channel, event, description) {
    exports.logsnag.publish({
        description,
        project: 'mhvotifier',
        ...getPublishLogOptions(event),
    });
}
exports.publishlog = publishlog;
function getPublishLogOptions(event) {
    switch (event) {
        case 'create':
            return {
                channel: 'creations',
                event: 'Server Creation',
                icon: '➕',
                notify: true,
            };
        default:
            return {
                channel: 'other',
                event: 'Unknown',
                icon: '❓',
                notify: false,
            };
    }
}
//# sourceMappingURL=logger.js.map