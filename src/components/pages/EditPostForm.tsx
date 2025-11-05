"use client";

import { updatePost } from "@/lib/client/firebaseClient";
import { getPostByID } from "@/lib/server/firebaseAdminOps";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";

export default function EditPostForm({ id }: { id: string }) {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");

    async function editSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await updatePost(id, title, caption);

            alert("Edit success!");

            location.reload();
        } catch (e) {
            alert(e);
        }
    }

    async function getPostData() {
        const post = await getPostByID(id);
        console.log(post);

        setTitle(post?.title!);
        setCaption(post?.desc!);
    }

    useEffect(() => {
        getPostData();
    }, []);

    return (
        <form onSubmit={editSubmit} className="lg:w-[50%] mx-auto flex flex-col gap-4 items-center py-[20px] rounded-xl">

            <div className="relative w-full mx-auto">
                <input className="input input-accent w-full" type="text" placeholder="Title" required
                    value={title} onChange={(e) => { setTitle(e.target.value); }} />
            </div>

            <div className="relative w-full mx-auto">
                <textarea className="textarea textarea-accent w-full h-[150px] resize-none" placeholder="Caption Here!" required
                    value={caption} onChange={(e) => { setCaption(e.target.value); }} ></textarea>
            </div>

            <button type="submit" className="btn btn-primary mt-[30px]">
                Edit
                <BiEdit />
            </button>
        </form>
    );
}