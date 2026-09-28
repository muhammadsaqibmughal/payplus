/** Shared JWT secret so cookies work without Postgres. Override in Vercel env for anything beyond a demo. */
export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  return "paypulse-csv-test-session-secret-32chars!";
}
