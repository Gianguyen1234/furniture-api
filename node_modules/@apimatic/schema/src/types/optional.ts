import { Schema } from '../schema';
import { isNullOrMissing } from '../utils';

/**
 * Create an optional schema.
 *
 * The optional schema allows 'undefined' or the values allowed by the given
 * 'schema'.
 */
export function optional<T, S>(
  schema: Schema<T, S>
): Schema<T | undefined, S | undefined | null> {
  return {
    type: () => `Optional<${schema.type()}>`,
    validateBeforeMap: (value, ctxt) =>
      isNullOrMissing(value) ? [] : schema.validateBeforeMap(value, ctxt),
    validateBeforeUnmap: (value, ctxt) =>
      typeof value === 'undefined'
        ? []
        : schema.validateBeforeUnmap(value, ctxt),
    map: (value, ctxt) =>
      isNullOrMissing(value) ? undefined : schema.map(value, ctxt),
    unmap: (value, ctxt) =>
      typeof value === 'undefined' ? undefined : schema.unmap(value, ctxt),
    validateBeforeMapXml: (value, ctxt) =>
      typeof value === 'undefined'
        ? []
        : schema.validateBeforeMapXml(value, ctxt),
    mapXml: (value, ctxt) =>
      typeof value === 'undefined' ? undefined : schema.mapXml(value, ctxt),
    unmapXml: (value, ctxt) =>
      typeof value === 'undefined' ? undefined : schema.unmapXml(value, ctxt),
  };
}
