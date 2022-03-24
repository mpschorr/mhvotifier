"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedUtil = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("./config.json"));
class EmbedUtil extends discord_js_1.MessageEmbed {
    constructor(title, description, color) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.setColor(color);
        this.setFooter({
            text: config_json_1.default.embed.footer.text,
            iconURL: config_json_1.default.embed.footer.image,
        });
        this.setTimestamp();
    }
    static error(message) {
        return new EmbedUtil(config_json_1.default.embed.titles.error, message, config_json_1.default.embed.colors.error);
    }
    static success(message) {
        return new EmbedUtil(config_json_1.default.embed.titles.success, message, config_json_1.default.embed.colors.success);
    }
    static neutral(title, message) {
        return new EmbedUtil(title, message, config_json_1.default.embed.colors.neutral);
    }
    static permission(permission) {
        return new EmbedUtil(config_json_1.default.embed.titles.error, `You do not have permission for that command! (${permission.toUpperCase()})`, config_json_1.default.embed.colors.error);
    }
}
exports.EmbedUtil = EmbedUtil;
//# sourceMappingURL=embed.js.map