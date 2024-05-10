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
  const client = new Discord.Client();

  const storedCodes = process.env.codes?.split(',');
  const activeCodes = [];
  const activeSalts = [];
  await Promise.all(
    storedCodes.map(async (code) => {
      activeCodes.push(code.substring(0, code.indexOf('+')));
      activeSalts.push(code.substring(code.indexOf('+') + 1));
    })
  );

  let isProcessing = false;

  client.on('ready', () => {
    console.log('KingOfCoins is online!');
  });

  // Event listener for messages
  client.on('message', async (message) => {
    // Validate channel
    if (message.channel.id !== config.discord.channel_id) return;
    // Do not self-process messages
    if (message.author.id === '1205221932740386896') return;

    // Validate message pattern
    if (!message.content.startsWith('!ser') || message.content.length < 50 || message.author.bot) {
      message.delete();
      return;
    }

    // Message is eligible for further checks
    console.log(`Received "${message.content.slice(5)}" from ${message.author.username}`);

    // Validate address
    const address = message.content.split(' ')[1];
    const checkedAddress = checkAddress(address);
    if (!checkedAddress) {
      message.channel.send(`I don't understand this address, ${message.author.username}... 😕`);
      return;
    }

    // Verify promocode
    const promocode = message.content.split(' ')[2];
    const index = activeCodes.indexOf(promocode);
    if (index === -1) {
      message.channel.send(`Invalid promocode, ${message.author.username}... 😕`);
      return;
    }

    // Validate promocode
    const entry = await db.getCode(promocode);
    if (entry) {
      message.channel.send(`Promocode already used! 💼`);
      return;
    }

    // Address is eligible to receive tokens
    // Check if no pending txns are present on polkadot-api
    if (isProcessing) return;

    isProcessing = true; // Lock polkadot-api
    const amount = Number(activeSalts[index]) * 10 ** 10;
    const success = await sender.sendTokens(checkedAddress, amount.toString());
    isProcessing = false; // Release polkadot-api

    // Validate response from polkadot-api
    if (!success) {
      message.channel.send(`Sorry, something went wrong! Please try again...`);
      return;
    }

    // Add code redemption entry in db
    await db.saveOrUpdateCode(promocode, address, amount.toString());
    message.channel.send(`Sent ${amount / 10 ** 10} ZBS to ${message.author.username} against ${promocode}! 🎉`);
    return;
  });

  client.login(config.discord.token);
})();
