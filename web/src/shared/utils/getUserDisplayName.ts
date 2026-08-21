import type { User, UserName } from "src/shared/types/user";

type NamedUser = Pick<User, "name"> | { name?: Partial<UserName> | null };

const trimPart = (value?: string | null): string => value?.trim() ?? "";

/**
 * Compact header label ("Ada L."). Falls back when Apple Hide My Email
 * (or similar) leaves name fields empty — prefer a localized "Account"
 * over inventing a fake name or showing a private-relay email.
 */
export const getUserDisplayName = (
  user: NamedUser,
  fallback: string,
): string => {
  const given = trimPart(user.name?.givenName);
  const family = trimPart(user.name?.familyName);
  const familyInitial = family.charAt(0);

  if (given) {
    return familyInitial ? `${given} ${familyInitial}.` : given;
  }
  if (family) {
    return family;
  }
  return fallback;
};

/** Full "Given Family" for profile views; same empty-name fallback. */
export const getUserFullName = (user: NamedUser, fallback: string): string => {
  const given = trimPart(user.name?.givenName);
  const family = trimPart(user.name?.familyName);
  return [given, family].filter(Boolean).join(" ") || fallback;
};

/** Avatar letters from the real name; empty when Apple (etc.) sent none. */
export const getUserAvatarInitials = (user: NamedUser): string => {
  const given = trimPart(user.name?.givenName).charAt(0);
  const family = trimPart(user.name?.familyName).charAt(0);
  return `${given}${family}`.toUpperCase();
};
