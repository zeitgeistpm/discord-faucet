import fs from "fs";
import * as UtilCrypto from "@polkadot/util-crypto";
import { decodeAddress } from "@polkadot/keyring";

export const readDataFile = (filepath: string) => {
  const contents = fs.readFileSync(filepath, { encoding: 'utf-8' });

  const data = [];
  for (const line of contents.split('\n')) {
    // we don't want comments
    if (line.startsWith("#")) continue;
    // we don't want empty lines
    if (!line) continue;

    //ok now we have our data
    data.push(line.split(','));
  }

  return data;
}

export const sigVerify = (msg: string, sig: string, signer: string): boolean => {
  const res = UtilCrypto.signatureVerify(
    msg,
    sig,
    decodeAddress(signer),
  );

  return res.isValid;
}

// (async () => {
//   const data = readDataFile('data_final.csv');
//   await new Promise(res => setTimeout(() => res(true), 1000));
//   // console.log(data);

//   const msg = "5GGwEu3xQoAbxX65p6KKEHv97WUoqZRUfJuoTZf3Jc7hFoC7";
//   const signature = "0x32b2561423bcbc508f379176e4bb9f6256ae253e522ada175e348801995c56085b644761ebc1e13ca397e0a4169ce1b65967acc115f824f6e69ffb715bfbe189";

//   const res = UtilCrypto.signatureVerify(msg, signature, decodeAddress("GnYuDPq3ABXiAuXao8N8FH9G6m3eEEf7gkYrDvznQLBzxRq"));
//   console.log(res);
//   const res2 = UtilCrypto.schnorrkelVerify(msg, signature, decodeAddress("GnYuDPq3ABXiAuXao8N8FH9G6m3eEEf7gkYrDvznQLBzxRq"));
//   console.log(res2);
// })();

// 0x3547477745753378516f41627858363570364b4b454876393757556f715a5255664a756f545a66334a633768466f4337
