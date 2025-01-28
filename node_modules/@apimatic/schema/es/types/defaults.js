import { literalToString } from '../utils.js';

/**
 * Create a 'defaults' schema.
 *
 * During mapping or unmapping, if the value is null or undefined, the schema
 * defaults to the 'defaultValue' specified in the schema.
 */
function defaults(schema, defaultValue) {
  return {
    type: function () {
      return "Defaults<".concat(schema.type(), ",").concat(literalToString(defaultValue), ">");
    },
    validateBeforeMap: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? [] : schema.validateBeforeMap(v, ctxt);
    },
    validateBeforeUnmap: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? [] : schema.validateBeforeUnmap(v, ctxt);
    },
    map: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? defaultValue : schema.map(v, ctxt);
    },
    unmap: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? defaultValue : schema.unmap(v, ctxt);
    },
    validateBeforeMapXml: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? [] : schema.validateBeforeMapXml(v, ctxt);
    },
    mapXml: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? defaultValue : schema.mapXml(v, ctxt);
    },
    unmapXml: function (v, ctxt) {
      return shouldDefault(v, defaultValue) ? defaultValue : schema.unmapXml(v, ctxt);
    }
  };
}
function shouldDefault(value, defaultValue) {
  return value === null || value === undefined || value === defaultValue;
}
export { defaults };