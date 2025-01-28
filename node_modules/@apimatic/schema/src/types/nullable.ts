import { Schema } from '../schema';
import { isNullOrMissing } from '../utils';

/**
 * Creates a nullable schema.
 *
 * The nullable schema allows null values or the values allowed by the given
 * 'schema'.
 */
export function nullable<T, S>(
  schema: Schema<T, S>
): Schema<T | null, S | null | undefined> {
  return {
    type: () => `Nullable<${schema.type()}>`,
    validateBeforeMap: (value, ctxt) =>
      isNullOrMissing(value) ? [] : schema.validateBeforeMap(value, ctxt),
    validateBeforeUnmap: (value, ctxt) =>
      value === null ? [] : schema.validateBeforeUnmap(value, ctxt),
    map: (value, ctxt) =>
      isNullOrMissing(value) ? null : schema.map(value, ctxt),
    unmap: (value, ctxt) => (value === null ? null : schema.unmap(value, ctxt)),
    validateBeforeMapXml: (value, ctxt) =>
      value === null ? [] : schema.validateBeforeMapXml(value, ctxt),
    mapXml: (value, ctxt) =>
      value === null ? null : schema.mapXml(value, ctxt),
    unmapXml: (value, ctxt) =>
      value === null ? null : schema.unmapXml(value, ctxt),
  };
}
