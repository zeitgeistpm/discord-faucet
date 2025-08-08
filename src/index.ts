import { encodeAddress, decodeAddress } from "@polkadot/keyring";
import axios from "axios";
import { Client, GatewayIntentBits, Events } from "discord.js";

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
  const config = readConfig('test-config.toml');
  const db = new Db(config.database.path);
  const sender = await Sender.create(config.sender.endpoint, config.sender.seed);

  const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages
    ] 
  });

  client.once(Events.ClientReady, () => {
    console.log("Testnet Faucet is running");
  });

  // Create an event listener for messages
  client.on(Events.MessageCreate, async (message) => {
    // Check if message content is available (requires MessageContent intent)
    if (!message.content && message.author.id !== client.user?.id) {
      console.warn("Message content unavailable - MessageContent intent may be required");
      return;
    }
    
    if (message.content.startsWith("!drip")) {
      if (message.channelId == config.discord.channel_id) {
        const { id } = message.author;

        console.log(message.author)
        // Check if user has team roles (without privileged intents, we check the message author's roles)
        const member = message.member;
        const isOnTeam = member?.roles.cache.has(smallTeam) || member?.roles.cache.has(bigTeam) || false;
        let amount = 10 ** 11
        if (isOnTeam) {
          const requestedAmount = message.content.split(" ")[2];
          if (!!requestedAmount) {
            amount = Number(requestedAmount) * 10**10;
          }
        }
        const address = message.content.split(" ")[1];
        const checkedAddress = checkAddress(address);

        if (!checkedAddress) {
          await message.channel.send(
            `I don't understand this address, ${message.author.username}... 😕`
          );
          return;
        }

        // const { data } = await axios(`https://rmrk-check.zeitgeist.pm/valid/${address}`);
        // if (!data) {
        //   message.channel.send(
        //     `Sorry ${message.author.username} but I didn't find a NFT at this wallet address 😕`
        //   );
        //   return;
        // }

        const entry = await db.getUserWithId(message.author.id);

        if (!entry || ok(entry.at) || isOnTeam) {
          const success = await sender.sendTokens(checkedAddress, (amount).toString());

          if (success) {
            await db.saveOrUpdateUser(message.author.id, getNow());

            //console.log(amount);
            await message.channel.send(
              `Sent ${amount / 10**10} ZBS to ${message.author.username}! 🎉`
            );
          } else {
            await message.channel.send(
              `Sorry, something went wrong! Please try again...`
            );
          }

          return;
        } else {
          await message.channel.send(
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
