export class BaseTeachillClient {
  protected getCommonHeaders(): Record<string, string> {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
}

export class BaseTeachillAuthClient extends BaseTeachillClient {
  protected authToken: string;

  constructor(authToken: string) {
    super();
    this.authToken = this.getBearerToken(authToken);
  }

  protected getBearerToken(token: string): string {
    return `Bearer ${token}`;
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      Authorization: this.authToken,
    };
  }
}
