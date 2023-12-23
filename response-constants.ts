export const STALE = "max-age=0";
export const MAX_AGE_1_DAY = "max-age=86400";
export const MAX_AGE_1_HOUR = "max-age=3600";
export const MAX_AGE_5_MINUTES = "max-age=300, private";
export const MAX_AGE_1_YEAR = "public, max-age=2628000";
export const IMMUTABLE = "max-age=2628000, immutable";

export enum RedirectCodes {
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  Temporary = 307,
}
