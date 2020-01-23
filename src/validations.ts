type ValidatorType = (data: object) => null | ValidationError;

export class ValidationError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ValidationFailed extends Error {
  public errors: ValidationError[];

  constructor(message: string, errors: ValidationError[]) {
    super();
    this.message = message;
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export function shouldHaveField(field: string, type: string): ValidatorType {
  return function(data: object): null | ValidationError {
    if (!data.hasOwnProperty(field)) {
      return new ValidationError(`${field} is required`);
    }
    if (!(typeof data[field] === type)) {
      return new ValidationError(`${field} should have ${type} type`);
    }
    return null;
  };
}

export function shouldMatchRegexp(field: string, regexpLine: string): ValidatorType {
  const regexp = new RegExp(regexpLine);
  return function(data: object): null | ValidationError {
    return regexp.test(data[field])
      ? null
      : new ValidationError(`${field} value does not match the required pattern`);
  };
}

export function minLengthShouldBe(field: string, length: number): ValidatorType {
  return function(data: object): null | ValidationError {
    if (data[field].length < length) {
      return new ValidationError(`${field} length should be more than ${length}`);
    }
    return null;
  };
}

export function rangeShouldBe(field: string, min: number, max: number): ValidatorType {
  return function(data: object): null | ValidationError {
    if (data[field] < min || data[field] > max) {
      return new ValidationError(`${field} range should be between ${min} and ${max}`);
    }
    return null;
  };
}

export function valueShouldBeInEnum<E>(field: string, e: E): ValidatorType {
  return function(data: object): null | ValidationError {
    if (!Object.values(e).includes(data[field])) {
      return new ValidationError(`${field} does not exist with value ${data[field]}`);
    }
    return null;
  };
}

export class Validator<T> {
  private validators: ValidatorType[];
  private errors: ValidationError[];

  constructor(validators: ValidatorType[]) {
    this.validators = [...validators];
  }

  public validate(data: unknown): T {
    this.errors = [];

    for (const validator of this.validators) {
      const error = validator(data as object);
      if (error) {
        this.errors.push(error);
      }
    }

    if (this.errors.length > 0) {
      throw new ValidationFailed('Validation failed', this.errors);
    }

    return data as T;
  }
}
