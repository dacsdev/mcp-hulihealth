import validator from 'validator';

/**
 * Escapes potentially unsafe user provided strings.
 */
export function sanitizeInput(input: string): string {
  return validator.escape(input);
}
