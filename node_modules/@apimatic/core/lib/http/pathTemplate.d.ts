/** Marker for skipping URL-encoding when used with Path templating */
export declare class SkipEncode<T extends PathTemplatePrimitiveTypes> {
    value: T;
    constructor(value: T);
}
export type PathTemplatePrimitiveTypes = string | string[] | number | number[] | bigint | Array<bigint> | unknown;
/** Path template argument type */
export type PathTemplateTypes = PathTemplatePrimitiveTypes | SkipEncode<PathTemplatePrimitiveTypes>;
/**
 * URL path templating method.
 *
 * Template arguments of array type are imploded using the path separator and
 * individual elements are URL-encoded.
 *
 * Template arguments are URL-encoded unless wrapped in a SkipEncode instance.
 */
export declare function pathTemplate(strings: TemplateStringsArray, ...args: PathTemplateTypes[]): string;
//# sourceMappingURL=pathTemplate.d.ts.map