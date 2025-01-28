"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToStream = void 0;
function convertToStream(content) {
    if (typeof content !== 'string') {
        return content;
    }
    return new Blob([content]);
}
exports.convertToStream = convertToStream;
