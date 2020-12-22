"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
const sender_1 = __importDefault(require("./sender"));
const time_1 = require("./time");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const config = config_1.readConfig();
    const db = new db_1.default(config.database.path);
    const sender = yield sender_1.default.create(config.sender.seed);
    const client = new discord_js_1.default.Client();
    client.on("ready", () => {
        console.log("ICH BIN REA/dy");
    });
    client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.content.startsWith("!drip")) {
            if (message.channel.id == config.discord.channel_id) {
                const address = message.content.split(" ")[1];
                if (!address || !address.startsWith("5") || address.length !== 48) {
                    message.channel.send(`I don't understand this address, ${message.author.username}... 😕`);
                    return;
                }
                const entry = yield db.getUserWithId(message.author.id);
                if (!entry || time_1.ok(entry.at)) {
                    const success = sender.sendTokens(address, (Math.pow(10, 10)).toString());
                    if (success) {
                        yield db.saveOrUpdateUser(message.author.id, time_1.getNow());
                        message.channel.send(`Sent 1 ZBP to ${message.author.username}! 🎉`);
                    }
                    else {
                        message.channel.send(`Sorry, something went wrong! Please try again...`);
                    }
                    return;
                }
                else {
                    message.channel.send(`You already request ZBP within the last 36 hours, ${message.author.username}! You can request again at ${time_1.isOkAt(entry.at).toUTCString()}.`);
                    return;
                }
            }
        }
    }));
    client.login(config.discord.token);
}))();
//# sourceMappingURL=index.js.map