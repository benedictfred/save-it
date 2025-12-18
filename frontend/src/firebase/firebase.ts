import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      user: result.user,
      idToken,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google sign-in failed";
    throw new Error(message);
  }
};
