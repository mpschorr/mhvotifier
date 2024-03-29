"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servers = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const ServerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    password: { type: String, required: true },
    votes: { type: Number, required: true },
    rsa: {
        private: { type: String, required: true },
        public: { type: String, required: true },
    },
});
const ServerModel = mongoose_1.model('Server', ServerSchema);
class Servers {
    //#region Management
    static async create(name, owner) {
        const rsa = crypto_1.generateKeyPairSync('rsa', { modulusLength: 2048 });
        const password = uuid_1.v4().replace(/-/g, '');
        return await new ServerModel({
            name,
            owner,
            password: password,
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
    static async getByName(name) {
        return await ServerModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }
    static async getSorted(min, max) {
        return await ServerModel.find().sort({ votes: -1 }).skip(min).limit(max);
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
    static async count() {
        return await ServerModel.estimatedDocumentCount();
    }
}
exports.Servers = Servers;
//# sourceMappingURL=server.js.map