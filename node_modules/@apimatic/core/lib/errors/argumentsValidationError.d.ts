import { SchemaValidationError } from '../schema';
/**
 * Thrown when one or more arguments passed to a method fail validation.
 */
export declare class ArgumentsValidationError extends Error {
    readonly errors: Record<string, SchemaValidationError[]>;
    constructor(errors: Record<string, SchemaValidationError[]>);
}
//# sourceMappingURL=argumentsValidationError.d.ts.map