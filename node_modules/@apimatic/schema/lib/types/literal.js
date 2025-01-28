"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literal = void 0;
var utils_1 = require("../utils");
function literal(literalValue) {
    var validate = function (value) { return literalValue === value; };
    var map = function () { return literalValue; };
    return (0, utils_1.createSymmetricSchema)({
        type: "Literal<".concat((0, utils_1.literalToString)(literalValue), ">"),
        validate: (0, utils_1.toValidator)(validate),
        map: map,
    });
}
exports.literal = literal;
