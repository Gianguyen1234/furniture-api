import { __assign, __read, __values } from 'tslib';
import { objectEntries } from '../utils.js';
import { dict } from './dict.js';
function dictWithXmlEntries(itemSchema) {
  var dictSchema = dict(itemSchema);
  var modifiedSchema = __assign({}, dictSchema);
  modifiedSchema.unmapXml = function (inputValue, ctxt) {
    var output = dictSchema.unmapXml(inputValue, ctxt);
    // Convert each entry to XML "entry" elements. The XML "entry" element looks
    // like this: `<entry key="key">value</entry>`. Note that the element name
    // "entry" is set later at the return.
    var entries = objectEntries(output).map(function (_a) {
      var _b = __read(_a, 2),
        key = _b[0],
        value = _b[1];
      return {
        $: {
          key: key
        },
        _: value
      };
    });
    return {
      entry: entries
    };
  };
  modifiedSchema.mapXml = function (value, ctxt) {
    var e_1, _a;
    // Empty dictionary
    if (!('entry' in value)) {
      return {};
    }
    var entries = value.entry;
    // For a single entry, the XML parser gives a single object instead of an array.
    // Make it an array for easier handling.
    if (!Array.isArray(entries)) {
      entries = [entries];
    }
    // Convert entry elements containing a key attribute and content to a dictionary.
    var dictObj = {};
    try {
      for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
        var item = entries_1_1.value;
        dictObj[item.$.key] = item._;
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    // Run validation on entry values against the item schema.
    // TODO: Maintain context and path when delegating validatin
    return dictSchema.mapXml(dictObj, ctxt);
  };
  modifiedSchema.validateBeforeMapXml = function (value, ctxt) {
    var e_2, _a;
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    // Empty dictionary case
    if (!('entry' in value)) {
      return [];
    }
    var entries = value.entry;
    // Non-repeating XML elements are passed as a single-object instead of an array of objects.
    // We normalize this behavior of the XML parser.
    if (!Array.isArray(entries)) {
      entries = [entries];
    }
    // Dictionary for all entries
    var dictObj = {};
    try {
      for (var entries_2 = __values(entries), entries_2_1 = entries_2.next(); !entries_2_1.done; entries_2_1 = entries_2.next()) {
        var entry = entries_2_1.value;
        // Fail if entry is not an XML element object.
        if (typeof entry !== 'object' || entry === null) {
          return ctxt.fail('Expected "entry" to be an XML element.');
        }
        // Fail if entry does not have an attribute named key.
        if (!('$' in entry) || !('key' in entry.$)) {
          return ctxt.fail('Expected "entry" element to have an attribute named "key".');
        }
        // Set entry in dictionary
        var typedEntry = entry;
        dictObj[typedEntry.$.key] = typedEntry._;
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    // Check all entry values against the item schema.
    // TODO: Maintain context and path when delegating validation
    return dictSchema.validateBeforeMapXml(dictObj, ctxt);
  };
  return modifiedSchema;
}
export { dictWithXmlEntries };