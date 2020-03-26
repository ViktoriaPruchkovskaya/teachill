export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ExistError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, ExistError.prototype);
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class PerformingError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    Object.setPrototypeOf(this, PerformingError.prototype);
  }
}
