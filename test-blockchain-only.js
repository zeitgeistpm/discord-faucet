// Test blockchain functionality without Discord
require('dotenv').config();
const { readConfig } = require('./dist/config');
const Sender = require('./dist/sender').default;
const { encodeAddress, decodeAddress } = require('@polkadot/keyring');

function checkAddress(address) {
  try {
    const raw = decodeAddress(address);
    return encodeAddress(raw, 73);
  } catch (err) {
    console.error('Invalid address:', err.message);
    return false;
  }
}

async function testBlockchainTransfer() {
  try {
    // Check for required environment variables
    const testAddress = process.env.TEST_WALLET_ADDRESS;
    const testAmount = process.env.TEST_AMOUNT || '10'; // Default 10 ZBS
    
    if (!testAddress) {
      console.log('❌ Please set TEST_WALLET_ADDRESS environment variable');
      return;
    }
    
    console.log('🔧 Loading test config...');
    const config = readConfig('test-config.toml');
    
    console.log('🌐 Connecting to Zeitgeist testnet...');
    const sender = await Sender.create(config.sender.endpoint, config.sender.seed);
    
    console.log('✅ Connected successfully!');
    
    // Validate the test address
    const validatedAddress = checkAddress(testAddress);
    
    if (!validatedAddress) {
      console.log('❌ Address validation failed');
      return;
    }
    
    console.log('✅ Address validation passed');
    console.log('Original:', testAddress);
    console.log('Zeitgeist format:', validatedAddress);
    
    // Test the actual transfer
    const amount = (parseFloat(testAmount) * 10 ** 10).toString();
    console.log(`\n💸 Sending ${testAmount} ZBS to ${validatedAddress}`);
    
    const success = await sender.sendTokens(validatedAddress, amount);
    
    if (success) {
      console.log('🎉 Transfer successful!');
      console.log(`Check balance at: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fbsr.zeitgeist.pm#/accounts`);
    } else {
      console.log('❌ Transfer failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  process.exit(0);
}

console.log('🧪 Blockchain Transfer Test');
console.log('⚠️  WARNING: This will send real testnet tokens!');
console.log('Press Ctrl+C to cancel or wait 3 seconds to continue...\n');

setTimeout(() => {
  testBlockchainTransfer();
}, 6000);