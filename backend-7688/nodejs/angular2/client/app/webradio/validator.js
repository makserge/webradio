import { validate } from 'validate.js';

export function validatorFactory(validationName, options = {}) {
  let validateOptions = {};
  validateOptions[validationName] = options;

  let constraints = { inputField: validateOptions };

  return function urlValidator(control) {
    let attributes = { inputField: control.value };

    let result = validate(attributes, constraints);

    if (result) {
      let validationResult = {};
      validationResult[validationName] = true;
      return validationResult;
    }
  };
}

export function duplicateValidator(items) {
  return function(control) {
	let value = control.value.trim();
	if (items) {
	  for (let item in items) {
		  if (value == items[item].title) {
			return { duplicate: true };
		  }
	  }
	}	
    return null;
  };
}
