import { encodeAddress, decodeAddress } from '@polkadot/keyring';
import Discord from 'discord.js';

import { readConfig } from './config';
import Db from './db';
import Sender from './sender';

require('dotenv').config();

const checkAddress = (address): string | false => {
  try {
    const raw = decodeAddress(address);
    return encodeAddress(raw, 73);
  } catch (err) {
    console.error(err);
    return false;
  }
};

(async () => {
  const config = readConfig('main-config.toml');
  const db = new Db(config.database.path);
  const sender = await Sender.create(config.sender.endpoint, config.sender.seed);
  const activeCodes = process.env.codes?.split(',');

  const client = new Discord.Client();

  client.on('ready', () => {
    console.log('KingOfCoins is online!');
  });

  // Create an event listener for messages
  client.on('message', async (message) => {
    if (message.content.startsWith('!ser')) {
      if (message.channel.id == config.discord.channel_id) {
        console.log(message.author);

        const address = message.content.split(' ')[1];
        const checkedAddress = checkAddress(address);
        if (!checkedAddress) {
          message.channel.send(`I don't understand this address, ${message.author.username}... 😕`);
          return;
        }

        const promocode = message.content.split(' ')[2];
        if (!activeCodes.includes(promocode)) {
          message.channel.send(`Invalid promocode, ${message.author.username}... 😕`);
          return;
        }

        const entry = await db.getCode(promocode);
        if (!entry) {
          const amount = 10 ** 10;
          const success = await sender.sendTokens(checkedAddress, amount.toString());
          if (success) {
            await db.saveOrUpdateCode(promocode, address);
            message.channel.send(`Sent ${amount / 10 ** 10} ZBS to ${message.author.username}! 🎉`);
          } else {
            message.channel.send(`Sorry, something went wrong! Please try again...`);
          }
        } else {
          message.channel.send(`Promocode already used! 💼`);
        }
        return;
      }
    }
  });

  client.login(config.discord.token);
})();
