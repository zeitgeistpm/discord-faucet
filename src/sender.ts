import SDK, { util } from "@zeitgeistpm/sdk";

export default class Sender {
  private sdk: SDK;
  private keypair;

  constructor(sdk: SDK, seed: string) {
    this.sdk = sdk;
    this.keypair = util.signerFromSeed(seed);
  }

  static async create(endpoint: string, seed: string): Promise<Sender> {
    const sdk = await SDK.initialize(endpoint);
    return new Sender(sdk, seed);
  }

  async sendTokens(dest: string, amount: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const unsub = await this.sdk.api.tx.balances
        .transfer(dest, amount)
        .signAndSend(this.keypair, ({ events = [], status }) => {
          if (status.isInBlock) {
            events.forEach(({ event: { data, method, section } }) => {
              if (section === "system" && method === "ExtrinsicSuccess") {
                console.log(data.toString());
                resolve(true);
              } else if (section === "system" && method === "ExtrinsicFailed") {
                resolve(false);
              }
            });

            unsub();
          }
        });
    });
  }
}
