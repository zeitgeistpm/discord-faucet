import { encodeAddress, decodeAddress } from "@polkadot/keyring";
import axios from "axios";
import Discord from "discord.js";

import { readConfig } from "./config";
import Db from "./db";
import Sender from "./sender";
import { isOkAt, getNow, ok } from "./time";

const checkAddress = (address): string | false => {
  try {
    const raw = decodeAddress(address);
    return encodeAddress(raw, 73);
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Discord role id for the "Team"
const smallTeam = "817442510854946816";
// Discord role id for the "team"
const bigTeam = "789386070441590816";

(async () => {
  const config = readConfig();
  const db = new Db(config.database.path);
  const sender = await Sender.create(config.sender.endpoint, config.sender.seed);

  const client = new Discord.Client();

  client.on("ready", () => {
    console.log("Discord Faucet v0.1.0 running");
  });

  // Create an event listener for messages
  client.on("message", async (message) => {
    if (message.content.startsWith("!drip")) {
      if (message.channel.id == config.discord.channel_id) {
        const { id } = message.author;

        console.log(message.author)
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
        const checkedAddress = checkAddress(address);

        if (!checkedAddress) {
          message.channel.send(
            `I don't understand this address, ${message.author.username}... 😕`
          );
          return;
        }

        const { data } = await axios(`https://rmrk-check.zeitgeist.pm/valid/${address}`);
        if (!data) {
          message.channel.send(
            `Sorry ${message.author.username} but I didn't find a NFT at this wallet address 😕`
          );
          return;
        }

        const entry = await db.getUserWithId(message.author.id);

        if (!entry || ok(entry.at) || isOnTeam) {
          const success = await sender.sendTokens(checkedAddress, (amount).toString());

          if (success) {
            await db.saveOrUpdateUser(message.author.id, getNow());

            console.log(amount);
            message.channel.send(
              `Sent ${amount / 10**10} ZBS to ${message.author.username}! 🎉`
            );
          } else {
            message.channel.send(
              `Sorry, something went wrong! Please try again...`
            );
          }

          return;
        } else {
          message.channel.send(
            `You already requested ZBS within the last 24 hours, ${
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
