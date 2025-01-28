var XmlSerialization =
/*#__PURE__*/
/** @class */
function () {
  function XmlSerialization() {}
  XmlSerialization.prototype.xmlSerialize = function (_rootName, _value) {
    throw new Error('XML serialization is not available.');
  };
  XmlSerialization.prototype.xmlDeserialize = function (_rootName, _xmlString) {
    throw new Error('XML deserialization is not available.');
  };
  return XmlSerialization;
}();
export { XmlSerialization };