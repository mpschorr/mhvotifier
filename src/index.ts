import 'dotenv/config';

import './bot';
import './socket';

import { setupLogger } from './logger';
import { setupDB } from './db';
import { setupVotifier } from './votifier';

setupLogger();
setupDB();
setupVotifier();
