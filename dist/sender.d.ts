import SDK from "@zeitgeistpm/sdk";
export default class Sender {
    private sdk;
    private keypair;
    constructor(sdk: SDK, seed: string);
    static create(seed: string): Promise<Sender>;
    sendTokens(dest: string, amount: string): Promise<boolean>;
}
