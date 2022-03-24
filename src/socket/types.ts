//#region Incoming

import { Vote } from '../votifier/types';

interface IncomingPlayerUpdateSocketMessage {
    name: 'PLAYERCOUNT UPDATE';
    data: {
        playercount: number;
    };
}

interface IncomingVoteAcknowledgementSocketMessage {
    name: 'VOTE ACKNOWLEDGEMENT';
    data: {
        user: string;
    };
}

export type IncomingSocketMessage = IncomingPlayerUpdateSocketMessage | IncomingVoteAcknowledgementSocketMessage;

//#endregion

//#region Outgoing

interface OutgoingVoteSocketMessage {
    name: 'VOTE';
    data: Vote;
}

interface OutgoingErrorSocketMessage {
    name: 'ERROR';
    data: {
        message: string;
        code: number;
    };
}

export type OutgoingSocketMessage = OutgoingVoteSocketMessage | OutgoingErrorSocketMessage;

//#endregion
