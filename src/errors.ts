/**
 * Base class for Ocra errors.
 */
export class OcraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OcraError';
  }
}

/**
 * Error thrown when an invalid provider is used.
 */
export class InvalidProviderError extends OcraError {
  constructor(provider: string) {
    super(`Invalid provider: ${provider}`);
    this.name = 'InvalidProviderError';
  }
}

/**
 * Error thrown when an invalid input is provided.
 */
export class InvalidInputError extends OcraError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
