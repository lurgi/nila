import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "@/config/env.js";

export type VerifiedToken = {
  providerId: string;
  email?: string;
  name?: string;
  profileImage?: string;
};

const appleJWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys"),
);

const googleJWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export const verifyAppleToken = async (
  idToken: string,
): Promise<VerifiedToken> => {
  const { payload } = await jwtVerify(idToken, appleJWKS, {
    issuer: "https://appleid.apple.com",
    audience: env.APPLE_BUNDLE_ID,
  });

  const sub = payload.sub;
  if (!sub) {
    throw new Error("Apple token missing sub claim");
  }

  return {
    providerId: sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
};

export const verifyGoogleToken = async (
  idToken: string,
): Promise<VerifiedToken> => {
  const { payload } = await jwtVerify(idToken, googleJWKS, {
    issuer: "https://accounts.google.com",
    audience: env.GOOGLE_CLIENT_ID,
  });

  const sub = payload.sub;
  if (!sub) {
    throw new Error("Google token missing sub claim");
  }

  return {
    providerId: sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    profileImage:
      typeof payload.picture === "string" ? payload.picture : undefined,
  };
};
