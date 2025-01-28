import { Schema } from '../schema';
import { objectEntries } from '../utils';
import { dict } from './dict';

export function dictWithXmlEntries<T, S>(
  itemSchema: Schema<T, S>
): Schema<Record<string, T>, Record<string, S>> {
  const dictSchema = dict(itemSchema);
  const modifiedSchema = { ...dictSchema };

  modifiedSchema.unmapXml = (inputValue, ctxt) => {
    const output: Record<string, S> = dictSchema.unmapXml(inputValue, ctxt);

    // Convert each entry to XML "entry" elements. The XML "entry" element looks
    // like this: `<entry key="key">value</entry>`. Note that the element name
    // "entry" is set later at the return.
    const entries = objectEntries(output).map(([key, value]) => ({
      $: { key },
      _: value,
    }));

    return { entry: entries };
  };

  modifiedSchema.mapXml = (value, ctxt) => {
    // Empty dictionary
    if (!('entry' in value)) {
      return {};
    }

    let { entry: entries } = value as {
      entry: Array<{ $: { key: string }; _: unknown }>;
    };

    // For a single entry, the XML parser gives a single object instead of an array.
    // Make it an array for easier handling.
    if (!Array.isArray(entries)) {
      entries = [entries];
    }

    // Convert entry elements containing a key attribute and content to a dictionary.
    const dictObj: Record<string, unknown> = {};
    for (const item of entries) {
      dictObj[item.$.key] = item._;
    }

    // Run validation on entry values against the item schema.
    // TODO: Maintain context and path when delegating validatin
    return dictSchema.mapXml(dictObj, ctxt);
  };

  modifiedSchema.validateBeforeMapXml = (value, ctxt) => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }

    // Empty dictionary case
    if (!('entry' in value)) {
      return [];
    }

    let entries = (value as { entry: object[] }).entry;

    // Non-repeating XML elements are passed as a single-object instead of an array of objects.
    // We normalize this behavior of the XML parser.
    if (!Array.isArray(entries)) {
      entries = [entries];
    }

    // Dictionary for all entries
    const dictObj: Record<string, unknown> = {};

    for (const entry of entries) {
      // Fail if entry is not an XML element object.
      if (typeof entry !== 'object' || entry === null) {
        return ctxt.fail('Expected "entry" to be an XML element.');
      }

      // Fail if entry does not have an attribute named key.
      if (!('$' in entry) || !('key' in (entry as { $: object }).$)) {
        return ctxt.fail(
          'Expected "entry" element to have an attribute named "key".'
        );
      }

      // Set entry in dictionary
      const typedEntry = entry as { $: { key: string }; _: unknown };
      dictObj[typedEntry.$.key] = typedEntry._;
    }

    // Check all entry values against the item schema.
    // TODO: Maintain context and path when delegating validation
    return dictSchema.validateBeforeMapXml(dictObj, ctxt);
  };

  return modifiedSchema;
}
