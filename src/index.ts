import Discord from "discord.js";

import { readConfig } from "./config";
import Db from "./db";
import Sender from "./sender";
import { isOkAt, getNow, ok } from "./time";

(async () => {
  const config = readConfig();
  const db = new Db(config.database.path);
  const sender = await Sender.create(config.sender.seed);

  const client = new Discord.Client();

  client.on("ready", () => {
    console.log("ICH BIN REA/dy");
  });

  // Create an event listener for messages
  client.on("message", async (message) => {
    if (message.content.startsWith("!drip")) {
      if (message.channel.id == config.discord.channel_id) {
        // console.log(message.author);
        const address = message.content.split(" ")[1];
        if (!address || !address.startsWith("5") || address.length !== 48) {
          message.channel.send(
            `I don't understand this address, ${message.author.username}... 😕`
          );
          return;
        }

        const entry = await db.getUserWithId(message.author.id);

        if (!entry || ok(entry.at)) {
          const success = sender.sendTokens(address, (10 ** 10).toString());

          if (success) {
            await db.saveOrUpdateUser(message.author.id, getNow());

            message.channel.send(
              `Sent 1 ZBP to ${message.author.username}! 🎉`
            );
          } else {
            message.channel.send(
              `Sorry, something went wrong! Please try again...`
            );
          }

          return;
        } else {
          message.channel.send(
            `You already requested ZBP within the last 36 hours, ${
              message.author.username
            }! You can request again at ${isOkAt(entry.at).toUTCString()}.`
          );
          return;
        }
      }
    }
  });

  client.login(config.discord.token);
})();
