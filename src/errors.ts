export class OcraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OcraError';
  }
}

export class InvalidProviderError extends OcraError {
  constructor(provider: string) {
    super(`Invalid provider: ${provider}`);
    this.name = 'InvalidProviderError';
  }
}

export class InvalidInputError extends OcraError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
