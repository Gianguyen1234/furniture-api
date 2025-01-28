import { Schema, SchemaContextCreator, SchemaValidationError } from '../schema';
import { objectEntries } from '../utils';

/**
 * Create a dictionary schema.
 *
 * This can be used to map/unmap a type like Record<string, something>.
 */
export function dict<T, S>(
  itemSchema: Schema<T, S>
): Schema<Record<string, T>, Record<string, S>> {
  const validate = (
    validateFn:
      | 'validateBeforeMap'
      | 'validateBeforeUnmap'
      | 'validateBeforeMapXml',
    value: unknown,
    ctxt: SchemaContextCreator
  ): SchemaValidationError[] => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    const valueObject = value as Record<string, unknown>;
    return ctxt.flatmapChildren(
      objectEntries(valueObject),
      itemSchema,
      (v, childCtxt) => itemSchema[validateFn](v[1], childCtxt)
    );
  };

  return {
    type: () => `Record<string,${itemSchema.type()}>`,
    validateBeforeMap: (...args) => validate('validateBeforeMap', ...args),
    validateBeforeUnmap: (...args) => validate('validateBeforeUnmap', ...args),
    map: (value, ctxt) => {
      const output: Record<string, T> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.map(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
    unmap: (value, ctxt) => {
      const output: Record<string, S> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.unmap(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
    validateBeforeMapXml: (...args) =>
      validate('validateBeforeMapXml', ...args),
    mapXml: (value, ctxt) => {
      const output: Record<string, T> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.mapXml(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
    unmapXml: (value, ctxt) => {
      const output: Record<string, S> = {};
      for (const key in value) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const propValue = value[key];
          output[key] = itemSchema.unmapXml(
            propValue,
            ctxt.createChild(key, propValue, itemSchema)
          );
        }
      }
      return output;
    },
  };
}
