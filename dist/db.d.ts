export default class Db {
    private store;
    constructor(dbPath: string);
    saveOrUpdateUser(userId: string, at: number): Promise<boolean>;
    getUserWithId(userId: string): Promise<{
        userId: string;
        at: number;
    } | null>;
}
