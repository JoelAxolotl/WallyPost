import { PostingType } from "@/types/PostingType";
import { FirebaseError, FirebaseOptions, initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signOut,
    getAuth,
    signInWithEmailAndPassword,
    updateProfile,
    AuthErrorCodes
} from "firebase/auth";
import { get, getDatabase, push, ref, remove, set, update } from "firebase/database";

const options: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_fb_api_key,
    authDomain: process.env.NEXT_PUBLIC_fb_auth_domain,
    databaseURL: process.env.NEXT_PUBLIC_fb_database_url,
    projectId: "wallypostdemo",
    appId: process.env.NEXT_PUBLIC_fb_app_id,
    measurementId: "G-1LWRE6P367"
};

const app = initializeApp(options);

export const clientAuth = getAuth(app);
export const clientDB = getDatabase(app);

export async function signUpEmail(username: string, email: string, password: string) {
    try {
        const cred = await createUserWithEmailAndPassword(clientAuth, email, password);
        const user = cred.user;

        await updateProfile(user, {
            displayName: username
        });

        console.log("New user register!", username, "\nEmail :", email)
    } catch (e) {
        if (e instanceof FirebaseError) {

            console.log(e.message);
            console.log(e.code);

            if (e.code == AuthErrorCodes.WEAK_PASSWORD) {
                throw new Error("Password should be at least 6 characters");
            }
            if (e.code == AuthErrorCodes.EMAIL_EXISTS) {
                throw new Error("Email has been registered");
            }
        }

        throw e
    }
}

export async function signInEmail(email: string, password: string) {
    try {
        const cred = await signInWithEmailAndPassword(clientAuth, email, password);
        const user = cred.user;

        console.log("New user login!", user.displayName, "\nEmail :", email);
    } catch (e) {
        if (e instanceof FirebaseError) {

            console.log(e.message);
            console.log(e.code);

            if (e.code == "auth/invalid-credential") {
                throw new Error("Invalid credentials! Make sure your email and password is correct.");
            }

            if (e.code == "auth/invalid-email") {
                throw new Error("Email is not valid!");
            }
        }

        throw e
    }
}

export async function signOutUser() {
    await signOut(clientAuth);
}

export async function deletePost(id: string) {
    const post = ref(clientDB, `postings/${id}`);
    const snapshot = await get(post);
    const data = snapshot.val() as PostingType;

    if (data.author == clientAuth.currentUser?.uid) {
        await remove(post);
    }
}

export async function updatePost(id: string, title: string, desc: string) {
    const post = ref(clientDB, `postings/${id}`);
    const snapshot = await get(post);
    const data = snapshot.val() as PostingType;

    if (data.author == clientAuth.currentUser?.uid) {
        data.title = title;
        data.desc = desc;

        await update(post, data);
    }
}

export async function postContent(title: string, caption: string, image?: string | null) {
    try {
        const user = clientAuth.currentUser;
        const timestamp = Date.now();
        const id = user?.uid! + "-" + timestamp
        var posting: PostingType = {
            id: id,
            createdAt: timestamp,
            author: user?.uid!,
            title: title,
            desc: caption,
        };

        if (image) {
            posting.imageUrl = image;
        }

        const dir = ref(clientDB, `postings/${id}`);
        await set(dir, posting);
    } catch (e) {
        throw e;
    }
}