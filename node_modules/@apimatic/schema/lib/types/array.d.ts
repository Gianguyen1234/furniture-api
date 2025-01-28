import { Schema } from '../schema';
export interface ArrayXmlOptions {
    xmlItemName: string;
}
/**
 * Create an array schema.
 *
 * The array must be a homogenous array confirming to the itemsSchema. Each item
 * will be mapped/unmapped using the itemsSchema.
 */
export declare function array<T, S>(itemsSchema: Schema<T, S>, xmlOptions?: ArrayXmlOptions): Schema<T[], S[]>;
//# sourceMappingURL=array.d.ts.map