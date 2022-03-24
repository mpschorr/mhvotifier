"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./bot");
require("./socket");
const logger_1 = require("./logger");
const db_1 = require("./db");
const votifier_1 = require("./votifier");
(0, logger_1.setupLogger)();
(0, db_1.setupDB)();
(0, votifier_1.setupVotifier)();
//# sourceMappingURL=index.js.map