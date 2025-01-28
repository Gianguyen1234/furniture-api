import { validateAndUnmap } from '@apimatic/schema';
import { ArgumentsValidationError } from '../errors/argumentsValidationError.js';

/**
 * Prepares arguments for being sent in the API request.
 *
 * Each argument is validated and converted to a JSON-serialization ready value.
 *
 * If one or more arguments fail validation, an ArgumentsValidationError is
 * thrown, which contains the validation details for all arguments that failed
 * validation.
 *
 * @param params Map of arguments with values and schema
 * @returns Map of serialization-ready argument values
 *
 * @throws ArgumentsValidationError
 */
function prepareArgs(params) {
  var validationErrors = {};
  var result = {};
  for (var paramName in params) {
    if (Object.prototype.hasOwnProperty.call(params, paramName)) {
      var paramInfo = params[paramName];
      var validationResult = validateAndUnmap(paramInfo[0], paramInfo[1]);
      if (validationResult.errors) {
        validationErrors[paramName] = validationResult.errors;
      } else {
        result[paramName] = validationResult.result;
      }
    }
  }
  if (Object.keys(validationErrors).length > 0) {
    throw new ArgumentsValidationError(validationErrors);
  }
  return result;
}
export { prepareArgs };