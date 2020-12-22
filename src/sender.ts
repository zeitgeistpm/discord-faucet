import SDK, { util } from "@zeitgeistpm/sdk";

export default class Sender {
  private sdk: SDK;
  private keypair;

  constructor(sdk: SDK, seed: string) {
    this.sdk = sdk;
    this.keypair = util.signerFromSeed(seed);
  }

  static async create(seed: string): Promise<Sender> {
    const sdk = await SDK.initialize();
    return new Sender(sdk, seed);
  }

  async sendTokens(dest: string, amount: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const unsub = await this.sdk.api.tx.balances
        .transfer(dest, amount)
        .signAndSend(this.keypair, ({ events = [], status }) => {
          if (status.isInBlock) {
            events.forEach(({ event: { method, section } }) => {
              if (section === "System" && method === "ExtrinsicSuccess") {
                resolve(true);
              } else if (section === "System" && method === "ExtrinsicFailed") {
                resolve(false);
              }
            });

            unsub();
          }
        });
    });
  }
}
