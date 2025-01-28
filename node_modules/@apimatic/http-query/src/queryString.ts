import {
  FileWrapper,
  isFileWrapper,
  cloneFileWrapper,
} from '@apimatic/file-wrapper';

/**
 * Type for Key-value pair for form-urlencoded serialization
 */
export interface FormKeyValuePair {
  key: string;
  value: string | FileWrapper;
}

/**
 * Type for list of key-value pairs for form-urlencoded serialization
 */
export type FormKeyValuePairList = FormKeyValuePair[];

/**
 * Type for formatting function used to create key for nested arrays
 */
export type ArrayPrefixFunction = (
  key: string,
  value: any[],
  result: FormKeyValuePairList
) => void;

export function objectEncoding(
  key: string,
  iter: number,
  value: any,
  prefixFormat: ArrayPrefixFunction
): FormKeyValuePairList {
  return formDataEncodeObject({ [`${key}[${iter}]`]: value }, prefixFormat);
}

export function objectArrayEncoding(
  key: string,
  value: any[],
  prefixFormat: ArrayPrefixFunction,
  result: FormKeyValuePairList
) {
  for (let iter = 0; iter < value.length; iter += 1) {
    result.push(...objectEncoding(key, iter, value[iter], prefixFormat));
  }
}

/**
 * Array prefix format: item[1]=1&item[2]=2
 */
export const indexedPrefix: ArrayPrefixFunction = (key, value, result) => {
  for (let iter = 0; iter < value.length; iter += 1) {
    result.push(...objectEncoding(key, iter, value[iter], indexedPrefix));
  }
};

/**
 * Array prefix format: item[]=1&item[]=2
 */
export const unindexedPrefix: ArrayPrefixFunction = (key, value, result) => {
  if (value.some((val) => typeof val === 'object')) {
    objectArrayEncoding(key, value, unindexedPrefix, result);
  } else {
    for (const val of value) {
      result.push(
        ...formDataEncodeObject({ [key + '[]']: val }, unindexedPrefix)
      );
    }
  }
};

/**
 * Array prefix format: item=1&item=2
 */
export const plainPrefix: ArrayPrefixFunction = (key, value, result) => {
  if (value.some((val) => typeof val === 'object')) {
    objectArrayEncoding(key, value, plainPrefix, result);
  } else {
    for (const val of value) {
      result.push(...formDataEncodeObject({ [key]: val }, plainPrefix));
    }
  }
};

/**
 * Array prefix format: item=1\t2
 */
export const tabPrefix: ArrayPrefixFunction = (key, value, result) => {
  if (value.some((val) => typeof val === 'object')) {
    objectArrayEncoding(key, value, tabPrefix, result);
  } else {
    const prefixedArray = value.map((element) => element.toString()).join('\t');
    result.push(...[{ key, value: prefixedArray }]);
  }
};

/**
 * Array prefix format: item=1,2
 */
export const commaPrefix: ArrayPrefixFunction = (key, value, result) => {
  if (value.some((val) => typeof val === 'object')) {
    objectArrayEncoding(key, value, commaPrefix, result);
  } else {
    const prefixedArray = value.map((element) => element.toString()).join(',');
    result.push(...[{ key, value: prefixedArray }]);
  }
};

/**
 * Array prefix format: item=1|2
 */
export const pipePrefix: ArrayPrefixFunction = (key, value, result) => {
  if (value.some((val) => typeof val === 'object')) {
    objectArrayEncoding(key, value, pipePrefix, result);
  } else {
    const prefixedArray = value.map((element) => element.toString()).join('|');
    result.push(...[{ key, value: prefixedArray }]);
  }
};

/**
 * Converts an object to a list of key-value pairs for form-urlencoded serialization.
 *
 * @param obj The object to serialize
 * @param prefixFormat Formatting function to create key for nested arrays
 * @return Result of serialization
 */
export function formDataEncodeObject(
  obj: Record<string, unknown>,
  prefixFormat: ArrayPrefixFunction = indexedPrefix
): FormKeyValuePairList {
  const result: FormKeyValuePairList = [];

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value === null || value === undefined) {
      continue;
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      result.push({ key, value: value.toString() });
    } else if (isFileWrapper(value)) {
      result.push({ key, value: cloneFileWrapper(value) });
    } else if (Array.isArray(value)) {
      prefixFormat(key, value, result);
    } else if (typeof value === 'object') {
      for (const objectKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, objectKey)) {
          const element = value[objectKey as keyof typeof value];
          result.push(
            ...formDataEncodeObject(
              {
                [`${key}[${objectKey}]`]: element,
              },
              prefixFormat
            )
          );
        }
      }
    }
  }

  return result;
}

/**
 * Return a new list with all key-value pairs, which have a FileWrapper as value, removed
 *
 * @param params List of key-value pairs
 */
export function filterFileWrapperFromKeyValuePairs(
  params: FormKeyValuePairList
): Array<{ key: string; value: string }> {
  return params.filter((p) => !isFileWrapper(p.value)) as any;
}

/**
 * Serializes an object for a form-urlencoded request.
 *
 * Nested and complex types in values will be flattened using {@link formDataEncodeObject() function} method.
 *
 * @param  obj The object to be serialized
 * @return The result of serialization
 */
export function urlEncodeObject(
  obj: Record<string, unknown>,
  prefixFormat?: ArrayPrefixFunction
): string {
  const params = formDataEncodeObject(obj, prefixFormat);
  return urlEncodeKeyValuePairs(params);
}

/**
 * Serializes a list of key-value pairs for a form-urlencoded request.
 *
 * @param params List of key-value pairs to serialize
 * @return The result of serialization
 */
export function urlEncodeKeyValuePairs(params: FormKeyValuePairList): string {
  const encode = encodeURIComponent;
  return params
    .map((p) => `${encode(p.key)}=${encode(p.value.toString())}`)
    .join('&');
}
