"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_promises_1 = __importDefault(require("nedb-promises"));
class Db {
    constructor(dbPath) {
        this.store = nedb_promises_1.default.create(dbPath);
    }
    saveOrUpdateUser(userId, at) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.store.findOne({ userId });
            if (!doc) {
                return !!(yield this.store.insert({ userId, at }));
            }
            else {
                return !!(yield this.store.update({ userId }, { $set: { at } }));
            }
        });
    }
    getUserWithId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.store.findOne({ userId });
        });
    }
}
exports.default = Db;
//# sourceMappingURL=db.js.map