import "dotenv/config";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);

if (!projectId) {
  throw new Error(
    "Missing FIREBASE_PROJECT_ID in server/.env"
  );
}

if (!clientEmail) {
  throw new Error(
    "Missing FIREBASE_CLIENT_EMAIL in server/.env"
  );
}

if (!privateKey) {
  throw new Error(
    "Missing FIREBASE_PRIVATE_KEY in server/.env"
  );
}

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          project_id: projectId,
          client_email: clientEmail,
          private_key: privateKey,
        }),
      });

const firebaseAuth = getAuth(firebaseApp);

export async function requireAuth(req, res, next) {
  try {
    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const token = authorization
      .slice(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const decodedToken =
      await firebaseAuth.verifyIdToken(token);

    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error(
      "Firebase authentication error:",
      error.message
    );

    return res.status(401).json({
      error:
        "Invalid or expired authentication token",
    });
  }
}