// firebaseAdmin.ts
import { App, getApps, getApp, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getAuth, Auth } from "firebase-admin/auth";
import { getDatabase, Database } from "firebase-admin/database";

// expect env var to contain base64-encoded JSON of service account
const serviceAccountBase64 = process.env.admin_service_account;
if (!serviceAccountBase64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var");
}
const serviceAccountJson = Buffer.from(serviceAccountBase64, "base64").toString("utf8");
const serviceAccount = JSON.parse(serviceAccountJson);

// sanitize private_key newlines (this is needed if newline escaped)
if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

const databaseURL = process.env.NEXT_PUBLIC_fb_database_url;
const projectId = "wallypostdemo";

if (!databaseURL) {
    throw new Error("Missing FIREBASE_DATABASE_URL env var");
}
if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID env var");
}

const appConfig = {
    credential: credential.cert(serviceAccount),
    databaseURL,
    projectId,
};

const firebaseApp: App = getApps().length === 0
    ? initializeApp(appConfig)
    : getApp();

export const serverAuth: Auth = getAuth(firebaseApp);
export const serverDB: Database = getDatabase(firebaseApp);
