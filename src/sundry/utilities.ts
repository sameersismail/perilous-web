export const LOG_LEVEL: boolean = false;

/**
 * Coerce a string to an integer---safely.
 */
export function parseInteger(s: string): number | undefined {
  const n = Number.parseInt(s);
  if (!Number.isNaN(n)) {
    return n;
  } else {
    return undefined;
  }
}

/**
 * Parse a floating point number---safely.
 */
export function parseFloating(s: string): number | undefined {
  const n = Number.parseFloat(s);
  if (!Number.isNaN(n)) {
    return n;
  } else {
    return undefined;
  }
}

/**
 * Round a floating point number to a given number of decimal places.
 */
export function roundFloat(n: number, dp: number): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

/**
 * Simple logging utility.
 */
export function log(event: unknown): void {
  if (LOG_LEVEL === false) {
    return;
  }
  const now = new Date();
  console.log(
    `[PW][${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}]` +
      ` ${event}`
  );
}
