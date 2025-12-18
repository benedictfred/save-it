import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      const formattedKey = privateKey
        .replace(/\\\\n/g, "\n")
        .replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
      console.warn(
        "Google authentication will not work without proper Firebase credentials"
      );
    }
  } else {
    console.warn(
      "Firebase credentials not found. Google authentication is disabled."
    );
    console.warn(
      "  To enable Google auth, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env"
    );
  }
}

export const auth = admin.apps.length > 0 ? admin.auth() : null;

export async function verifyIdToken(idToken: string) {
  if (!auth) {
    throw new Error(
      "Firebase Admin is not initialized. Please configure Firebase credentials in .env"
    );
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid ID token";
    throw new Error(`ID token verification failed: ${message}`);
  }
}
