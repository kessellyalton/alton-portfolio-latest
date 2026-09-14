/**
 * Simple auth helpers for the private dashboard.
 *
 * Two separate values:
 *   - DASHBOARD_PASSWORD: what the user types on the login page
 *   - DASHBOARD_TOKEN:    a random server-side string stored in the cookie
 *
 * Separating them means a leaked cookie is not the password, and the
 * password is never stored in the browser.
 */

export const COOKIE_NAME = "dash_auth";

export function checkPassword(password: string): boolean {
  const expected = process.env.DASHBOARD_PASSWORD || "";
  return expected.length > 0 && password === expected;
}

export function getToken(): string {
  return process.env.DASHBOARD_TOKEN || "";
}

export function isValidToken(token: string | undefined): boolean {
  const expected = getToken();
  return Boolean(expected) && token === expected;
}
