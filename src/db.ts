import Nedb from 'nedb-promises';

export default class Db {
  private store: Nedb<any>;

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

  async getUserWithId(userId: string): Promise<{ userId: string; at: number } | null> {
    return await this.store.findOne({ userId });
  }

  async saveOrUpdateCode(code: string, address: string, amount: string): Promise<boolean> {
    const doc = await this.store.findOne({ code });
    if (!doc) {
      return !!(await this.store.insert({ code, address, amount }));
    } else {
      return !!(await this.store.update({ code }, { $set: { address, amount } }));
    }
  }

  async getCode(code: string): Promise<{ address: string } | null> {
    return await this.store.findOne({ code });
  }
}
