"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servers = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const ServerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    key: { type: String, required: true },
    votes: { type: Number, required: true },
    rsa: {
        private: { type: String, required: true },
        public: { type: String, required: true },
    },
});
const ServerModel = (0, mongoose_1.model)('Server', ServerSchema);
class Servers {
    //#region Management
    static async create(name, owner) {
        const rsa = (0, crypto_1.generateKeyPairSync)('rsa', { modulusLength: 2048 });
        const key = (0, uuid_1.v4)().replace(/-/g, '');
        return await new ServerModel({
            name,
            owner,
            key: key,
            votes: 0,
            rsa: {
                public: rsa.publicKey.export({
                    type: 'spki',
                    format: 'pem',
                }),
                private: rsa.privateKey.export({
                    type: 'pkcs8',
                    format: 'pem',
                }),
            },
        }).save();
    }
    static async delete(query) {
        return await ServerModel.deleteMany(query);
    }
    static async get(query) {
        return await ServerModel.findOne(query);
    }
    static async getMany(query) {
        return await ServerModel.find(query);
    }
    static async getAll() {
        return await ServerModel.find();
    }
    //#endregion
    //#region other
    static async addVote(query) {
        return await ServerModel.findOneAndUpdate(query, {
            $inc: { votes: 1 },
        }, {
            new: true,
        });
    }
}
exports.Servers = Servers;
//# sourceMappingURL=server.js.map