import { Schema } from '../schema';
import { arrayEntries } from '../utils';

export interface ArrayXmlOptions {
  xmlItemName: string;
}

/**
 * Create an array schema.
 *
 * The array must be a homogenous array confirming to the itemsSchema. Each item
 * will be mapped/unmapped using the itemsSchema.
 */
export function array<T, S>(
  itemsSchema: Schema<T, S>,
  xmlOptions?: ArrayXmlOptions
): Schema<T[], S[]> {
  let arraySchema: Schema<T[], S[]>;
  arraySchema = {
    type: () => `Array<${itemsSchema.type()}>`,
    validateBeforeMap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeMap(v[1], childCtxt)
          )
        : ctxt.fail(),
    validateBeforeUnmap: (value, ctxt) =>
      Array.isArray(value)
        ? ctxt.flatmapChildren(
            arrayEntries(value),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeUnmap(v[1], childCtxt)
          )
        : ctxt.fail(),
    map: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.map(v[1], childCtxt)
      ),
    unmap: (value, ctxt) =>
      ctxt.mapChildren(arrayEntries(value), itemsSchema, (v, childCtxt) =>
        itemsSchema.unmap(v[1], childCtxt)
      ),
    mapXml: (value, ctxt) => {
      let items = value;
      if (xmlOptions?.xmlItemName) {
        items = value[xmlOptions.xmlItemName];
        ctxt = ctxt.createChild(xmlOptions.xmlItemName, items, itemsSchema);
      }
      return ctxt.mapChildren(
        arrayEntries(items as any[]),
        itemsSchema,
        (v, childCtxt) => itemsSchema.mapXml(v[1], childCtxt)
      );
    },
    unmapXml: (value, ctxt) => {
      const items = ctxt.mapChildren(
        arrayEntries(value),
        itemsSchema,
        (v, childCtxt) => itemsSchema.unmapXml(v[1], childCtxt)
      );
      if (xmlOptions?.xmlItemName) {
        return { [xmlOptions.xmlItemName]: items };
      } else {
        return items;
      }
    },
    validateBeforeMapXml: (value, ctxt) => {
      let items = value;
      if (xmlOptions?.xmlItemName) {
        const errorMessage = `Expected array to be wrapped with XML element ${xmlOptions.xmlItemName}.`;
        if (
          typeof value !== 'object' ||
          value === null ||
          !(xmlOptions.xmlItemName in value)
        ) {
          return ctxt.fail(errorMessage);
        }
        items = (value as Record<string, unknown>)[xmlOptions.xmlItemName];
        ctxt = ctxt.createChild(xmlOptions.xmlItemName, items, itemsSchema);
      }

      return Array.isArray(items)
        ? ctxt.flatmapChildren(
            arrayEntries(items),
            itemsSchema,
            (v, childCtxt) => itemsSchema.validateBeforeMapXml(v[1], childCtxt)
          )
        : ctxt.fail();
    },
  };
  return arraySchema;
}
