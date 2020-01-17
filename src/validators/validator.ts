interface SignupData {
  username: string;
  password: string;
  fullName: string;
}

interface ValidationError {
  message: string;
}

export class SignupValidator {
  public validate(data: unknown): SignupData | null {
    const usernameLengthError: ValidationError = {
      message: 'Username must not be empty',
    };

    if (this.validateShape(data)) {
      this.validateLength(data.username, usernameLengthError);
      return data;
    }
    return null;
  }

  private validateLength(data: string, error: ValidationError): string {
    if (data.length > 0) {
      return data;
    }
    throw new Error(error.message);
  }

  private validateShape(data: unknown): data is SignupData {
    const error: ValidationError = {
      message: 'Username, password and full name is required',
    };
    if (
      data.hasOwnProperty('username') &&
      data.hasOwnProperty('password') &&
      data.hasOwnProperty('fullName')
    ) {
      return (
        typeof (data as SignupData).username === 'string' &&
        (data as SignupData).password === 'string' &&
        (data as SignupData).fullName === 'string'
      );
    }
    throw new Error(error.message);
  }
}
