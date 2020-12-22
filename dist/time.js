"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.isOkAt = exports.getNow = exports.THIRTY_SIX_HOURS = void 0;
exports.THIRTY_SIX_HOURS = 1000 * 60 * 60 * 36;
const getNow = () => {
    return Date.now();
};
exports.getNow = getNow;
const isOkAt = (at) => {
    const now = exports.getNow();
    return new Date(at + exports.THIRTY_SIX_HOURS);
};
exports.isOkAt = isOkAt;
const ok = (at) => {
    const now = exports.getNow();
    return at + exports.THIRTY_SIX_HOURS <= now;
};
exports.ok = ok;
//# sourceMappingURL=time.js.map