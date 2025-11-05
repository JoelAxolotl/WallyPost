"use server";

import { PostingType } from "@/types/PostingType";
import { serverAuth, serverDB } from "./firebaseAdmin";

export async function getUserNameByID(uid: string) {
    const user = await serverAuth.getUser(uid);
    return user.displayName;
}

export async function getAllPost() {
    const snapshot = await serverDB.ref("postings").get();

    if (!snapshot.exists()) { return []; }

    const data = snapshot.val();
    var postingList: PostingType[] = [];

    Object.keys(data).map((key, i) => {
        const tempData = data[key];
        postingList.push(tempData);
    });

    return postingList;
}

export async function getPostByID(id: string) {
    const snapshot = await serverDB.ref(`postings/${id}`).get();

    if (!snapshot.exists()) { return undefined; }

    const data = snapshot.val();

    return data as PostingType;
}