"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlSerialization = void 0;
var XmlSerialization = /** @class */ (function () {
    function XmlSerialization() {
    }
    XmlSerialization.prototype.xmlSerialize = function (_rootName, _value) {
        throw new Error('XML serialization is not available.');
    };
    XmlSerialization.prototype.xmlDeserialize = function (_rootName, _xmlString) {
        throw new Error('XML deserialization is not available.');
    };
    return XmlSerialization;
}());
exports.XmlSerialization = XmlSerialization;
