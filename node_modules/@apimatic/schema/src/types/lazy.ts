import { Schema } from '../schema';
import { once } from '../utils';

/**
 * Create a schema that lazily delegates to the given schema.
 */
export function lazy<T, V>(schemaFn: () => Schema<T, V>): Schema<T, V> {
  const getSchema = once(schemaFn); // Memoize schema
  return {
    type: () => `Lazy<${getSchema().type()}>`,
    map: (...args) => getSchema().map(...args),
    unmap: (...args) => getSchema().unmap(...args),
    validateBeforeMap: (...args) => getSchema().validateBeforeMap(...args),
    validateBeforeUnmap: (...args) => getSchema().validateBeforeUnmap(...args),
    mapXml: (...args) => getSchema().mapXml(...args),
    unmapXml: (...args) => getSchema().unmapXml(...args),
    validateBeforeMapXml: (...args) =>
      getSchema().validateBeforeMapXml(...args),
  };
}
