/* eslint-disable max-classes-per-file */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PropertyRequiredError extends ValidationError {
  constructor(propertyName: string) {
    super(`Missing required property: ${propertyName}`);
    this.name = this.constructor.name;
  }
}

export class EnvironmentConfigurationError extends ValidationError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}