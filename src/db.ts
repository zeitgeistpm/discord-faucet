import Nedb from "nedb-promises";

export default class Db {
  private store: Nedb;

  constructor(dbPath: string) {
    this.store = Nedb.create(dbPath);
  }

  async saveOrUpdateUser(userId: string, at: number): Promise<boolean> {
    const doc = await this.store.findOne({ userId });
    if (!doc) {
      return !!(await this.store.insert({ userId, at }));
    } else {
      return !!(await this.store.update({ userId }, { $set: { at } }));
    }
  }

  async getUserWithId(
    userId: string
  ): Promise<{ userId: string; at: number } | null> {
    return await this.store.findOne({ userId });
  }

  async redeemCode(code: string, address: string): Promise<boolean> {
    return !!(await this.store.insert({ code, address }));
  }

  async getCode(code: string): Promise<{ address: string } | null> {
    return await this.store.findOne({ code });
  }

  // KSM Extension
  async saveOrUpdateKSMAddress(ksmAddress: string, done: boolean): Promise<boolean> {
    const doc = await this.store.findOne({ ksmAddress });
    if (!doc) {
      return !!(await this.store.insert({ ksmAddress, done }));
    } else {
      return !!(await this.store.update({ ksmAddress }, { $set: { done } }));
    }
  }

  async getKSMAddress(
    ksmAddress: string,
  ): Promise<{ ksmAddress: string, done: boolean } | null> {
    return await this.store.findOne({ ksmAddress });
  }
}
