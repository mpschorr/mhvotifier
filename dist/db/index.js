"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servers = exports.setupDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../logger");
function setupDB() {
    if (process.env.MONGO_URI) {
        mongoose_1.default
            .connect(process.env.MONGO_URI)
            .then(() => {
            logger_1.dbLogger.info('Connected to MongoDB');
        })
            .catch((e) => {
            logger_1.dbLogger.error(`Failed to connect to MongoDB: ${e}`);
        });
    }
    else {
        logger_1.dbLogger.error('Could not connect to database, no MONGO_URI specified.');
    }
}
exports.setupDB = setupDB;
var server_1 = require("./server");
Object.defineProperty(exports, "Servers", { enumerable: true, get: function () { return server_1.Servers; } });
//# sourceMappingURL=index.js.map