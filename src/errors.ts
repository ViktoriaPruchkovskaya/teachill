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
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
