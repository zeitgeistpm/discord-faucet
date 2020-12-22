"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importStar(require("@zeitgeistpm/sdk"));
class Sender {
    constructor(sdk, seed) {
        this.sdk = sdk;
        this.keypair = sdk_1.util.signerFromSeed(seed);
    }
    static create(seed) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = yield sdk_1.default.initialize();
            return new Sender(sdk, seed);
        });
    }
    sendTokens(dest, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const unsub = yield this.sdk.api.tx.balances
                    .transfer(dest, amount)
                    .signAndSend(this.keypair, ({ events = [], status }) => {
                    if (status.isInBlock) {
                        events.forEach(({ event: { method, section } }) => {
                            if (section === "System" && method === "ExtrinsicSuccess") {
                                resolve(true);
                            }
                            else if (section === "System" && method === "ExtrinsicFailed") {
                                resolve(false);
                            }
                        });
                        unsub();
                    }
                });
            }));
        });
    }
}
exports.default = Sender;
//# sourceMappingURL=sender.js.map