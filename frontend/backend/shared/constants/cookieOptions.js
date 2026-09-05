export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? (process.env.COOKIE_DOMAIN ? "lax" : "none") : "lax",
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};