import { ColorResolvable, MessageEmbed } from 'discord.js';
import config from './config.json';

export class EmbedUtil extends MessageEmbed {
    public constructor(title: string, description: string, color: ColorResolvable) {
        super();
        this.setTitle(title);
        this.setDescription(description);
        this.setColor(color);
        this.setFooter({
            text: config.embed.footer.text,
            iconURL: config.embed.footer.image,
        });
        this.setTimestamp();
    }

    public static error(message: string) {
        return new EmbedUtil(config.embed.titles.error, message, config.embed.colors.error as ColorResolvable);
    }

    public static success(message: string) {
        return new EmbedUtil(config.embed.titles.success, message, config.embed.colors.success as ColorResolvable);
    }

    public static neutral(title: string, message: string) {
        return new EmbedUtil(title, message, config.embed.colors.neutral as ColorResolvable);
    }

    public static permission(permission: string) {
        return new EmbedUtil(
            config.embed.titles.error,
            `You do not have permission for that command! (${permission.toUpperCase()})`,
            config.embed.colors.error as ColorResolvable,
        );
    }
}
