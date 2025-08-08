import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";

export default class Sender {
  private api: ApiPromise;
  private keypair: KeyringPair;

  constructor(api: ApiPromise, seed: string) {
    this.api = api;
    const keyring = new Keyring({ type: 'sr25519' });
    this.keypair = keyring.addFromUri(seed);
  }

  static async create(endpoint: string, seed: string): Promise<Sender> {
    const provider = new WsProvider(endpoint);
    const api = await ApiPromise.create({ provider });
    await api.isReady;
    return new Sender(api, seed);
  }

  async sendTokens(dest: string, amount: string): Promise<boolean> {
    console.log(`Processing ${amount} for ${dest}`)
    return new Promise(async (resolve) => {
      const unsub = await this.api.tx.balances
        .transferAllowDeath(dest, amount)
        .signAndSend(this.keypair, ({ events = [], status }) => {
          if (status.isInBlock) {
            events.forEach(({ event: { data, method, section } }) => {
              if (section === "system" && method === "ExtrinsicSuccess") {
                console.log(`Successfully sent ${amount} to ${dest}`);
                resolve(true);
              } else if (section === "system" && method === "ExtrinsicFailed") {
                console.log(`Failed to send ${amount} to ${dest}!`);
                const errorData = data.toJSON() as any;
                if (errorData && errorData[0] && errorData[0].module) {
                  const { index, error } = errorData[0].module;
                  console.log(`Error: index=${index}, error=${error}`);
                }
                resolve(false);
              }
            });

            unsub();
          }
        });
    });
  }
}
