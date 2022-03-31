import { Schema, model, FilterQuery } from 'mongoose';
import { generateKeyPairSync } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface Server {
    name?: string;
    owner?: string;
    key?: string;
    votes?: number;
    rsa?: {
        private?: string;
        public?: string;
    };
}

const ServerSchema = new Schema<Server>({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    key: { type: String, required: true },
    votes: { type: Number, required: true },
    rsa: {
        private: { type: String, required: true },
        public: { type: String, required: true },
    },
});

const ServerModel = model<Server>('Server', ServerSchema);

export class Servers {
    //#region Management

    public static async create(name: string, owner: string) {
        const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 });
        const key = uuidv4().replace(/-/g, '');
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

    public static async delete(query: FilterQuery<Server>) {
        return await ServerModel.deleteMany(query);
    }

    public static async get(query: FilterQuery<Server>): Promise<Server | null> {
        return await ServerModel.findOne(query);
    }

    public static async getMany(query: FilterQuery<Server>): Promise<Server[]> {
        return await ServerModel.find(query);
    }

    public static async getAll(): Promise<Server[]> {
        return await ServerModel.find();
    }

    public static async getByName(name: string): Promise<Server | null> {
        return await ServerModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }

    public static async getSorted(min: number, max: number): Promise<Server[]> {
        return await ServerModel.find().sort({ votes: -1 }).skip(min).limit(max);
    }

    //#endregion

    //#region other

    public static async addVote(query: FilterQuery<Server>): Promise<Server | null> {
        return await ServerModel.findOneAndUpdate(
            query,
            {
                $inc: { votes: 1 },
            },
            {
                new: true,
            },
        );
    }

    public static async count(): Promise<number> {
        return await ServerModel.estimatedDocumentCount();
    }

    //#endregion
}
