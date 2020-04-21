export async function handleError(response: Response, errorType: string) {
  const { errors } = await response.json();
  const messages = errors.map((error: { message: string }) => error.message);
  throw new Error(`${errorType} error: Reason: ${messages.join(', ')}`);
}
