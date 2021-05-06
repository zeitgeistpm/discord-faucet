import Discord from "discord.js";

import { readConfig } from "./config";
import Db from "./db";
import Sender from "./sender";
import { isOkAt, getNow, ok } from "./time";

const smallTeam = "817442510854946816";
const bigTeam = "789386070441590816";

(async () => {
  const config = readConfig();
  const db = new Db(config.database.path);
  const sender = await Sender.create(config.sender.seed);

  const client = new Discord.Client();

  client.on("ready", () => {
    console.log("Discord Faucet v0.1.0 running");
  });

  // Create an event listener for messages
  client.on("message", async (message) => {
    if (message.content.startsWith("!drip")) {
      if (message.channel.id == config.discord.channel_id) {
        const { id } = message.author;
        const smTeam = await message.guild.roles.fetch(smallTeam);
        const lgTeam = await message.guild.roles.fetch(bigTeam);
        const isOnTeam = smTeam.members.has(id) || lgTeam.members.has(id);
        let amount = 10 ** 10
        if (isOnTeam) {
          const requestedAmount = message.content.split(" ")[2];
          if (!!requestedAmount) {
            amount = Number(requestedAmount) * 10**10;
          }
        }
        const address = message.content.split(" ")[1];
        if (!address || !address.startsWith("5") || address.length !== 48) {
          message.channel.send(
            `I don't understand this address, ${message.author.username}... 😕`
          );
          return;
        }

        const entry = await db.getUserWithId(message.author.id);

        if (!entry || ok(entry.at) || isOnTeam) {
          const success = sender.sendTokens(address, (amount).toString());

          if (success) {
            await db.saveOrUpdateUser(message.author.id, getNow());

            console.log(amount);
            message.channel.send(
              `Sent ${amount / 10**10} ZBP to ${message.author.username}! 🎉`
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
