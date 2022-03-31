"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinListener = void 0;
const framework_1 = require("@sapphire/framework");
const config_json_1 = __importDefault(require("../config.json"));
class JoinListener extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'guildMemberAdd',
        });
    }
    async run(guildMember) {
        guildMember.roles.add(config_json_1.default.member.role);
    }
}
exports.JoinListener = JoinListener;
//# sourceMappingURL=join.js.map