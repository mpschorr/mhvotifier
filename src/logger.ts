/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { configure, getLogger, Logger } from 'log4js';
import { LogSnag } from 'logsnag';

export let logsnag: LogSnag;

export let botLogger: Logger;
export let socketLogger: Logger;
export let dbLogger: Logger;
export let votifierLogger: Logger;

export function setupLogger() {
    configure({
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

    botLogger = getLogger('BOT');
    socketLogger = getLogger('SOCKET');
    dbLogger = getLogger('DB');
    votifierLogger = getLogger('VOTIFIER');

    logsnag = new LogSnag(process.env.LOGSNAG_TOKEN!);
}

type PublishLogEvent = 'create';
interface PublishLogEventOptions {
    channel: string;
    event: string;
    icon: string;
    notify: boolean;
}

export function publishlog(channel: string, event: PublishLogEvent, description: string) {
    logsnag.publish({
        description,
        project: 'mhvotifier',
        ...getPublishLogOptions(event),
    });
}

function getPublishLogOptions(event: string): PublishLogEventOptions {
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
