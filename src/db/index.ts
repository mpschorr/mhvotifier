import mongoose from 'mongoose';
import { dbLogger as logger } from '../logger';

export function setupDB() {
    if (process.env.MONGO_URI) {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => {
                logger.info('Connected to MongoDB');
            })
            .catch((e) => {
                logger.error(`Failed to connect to MongoDB: ${e}`);
            });
    } else {
        logger.error('Could not connect to database, no MONGO_URI specified.');
    }
}

export { Servers } from './server';
