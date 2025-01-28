"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknown = void 0;
var utils_1 = require("../utils");
/**
 * Create an unknown schema.
 *
 * The unknown schema allows any value.
 */
function unknown() {
    return (0, utils_1.createSymmetricSchema)({
        type: 'unknown',
        validate: function () { return []; },
        map: utils_1.identityFn,
    });
}
exports.unknown = unknown;
