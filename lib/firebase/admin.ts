import * as admin from "firebase-admin";

function initializeAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const key = process.env.FIREBASE_ADMIN_SDK_KEY;
  if (!key) {
    console.warn("FIREBASE_ADMIN_SDK_KEY not set. Server-side Firestore operations will not work.");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(key);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    return admin.app();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

export const adminApp = initializeAdmin();
export const adminDb = adminApp ? admin.firestore(adminApp) : null;
export const adminAuth = adminApp ? admin.auth(adminApp) : null;
