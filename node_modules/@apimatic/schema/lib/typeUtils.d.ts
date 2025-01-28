/**
 * Type utilities
 *
 * Some of these have been picked up from the superstruct library.
 */
/**
 * Type helper to Flatten the Union of optional and required properties.
 */
type Flatten<T> = T extends infer U ? {
    [K in keyof U]: U[K];
} : never;
/**
 * Type helper to extract the optional keys of an object
 */
type OptionalKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
/**
 * Type helper to extract the required keys of an object
 */
type RequiredKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];
/**
 * Type helper to create optional properties when the property value can be
 * undefined (ie. when `optional()` is used to define a type)
 */
export type OptionalizeObject<T> = Flatten<{
    [K in RequiredKeys<T>]: T[K];
} & {
    [K in OptionalKeys<T>]?: T[K];
}>;
export {};
//# sourceMappingURL=typeUtils.d.ts.map