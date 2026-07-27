export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.COOKIE_DOMAIN || process.env.NODE_ENV === "production") ? "lax" : "lax",
  domain: process.env.COOKIE_DOMAIN || (process.env.NODE_ENV === "production" ? ".prabhatranjan.live" : undefined),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};