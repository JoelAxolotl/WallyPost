"use client"

import { clientAuth, deletePost } from "@/lib/client/firebaseClient";
import { getPostByID, getUserNameByID } from "@/lib/server/firebaseAdminOps";
import { PostingType } from "@/types/PostingType";
import { Image } from "@imagekit/next";
import { format } from "date-fns";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import EditPostForm from "./pages/EditPostForm";

export default function CardPost({
    key, id, author, createdAt, desc, title, imageUrl
}: {
    key?: any,
    id: string,
    author: string;

    title: string;
    desc: string;

    imageUrl?: string

    createdAt: number;
}) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>();
    const [isFull, setIsFull] = useState(false);

    // const [postId, setPostId] = useState("");
    const [username, setUsername] = useState("");
    // const [title, setTitle] = useState("");
    // const [createdAt, setCreatedAt] = useState(0);
    // const [author, setAuthor] = useState("");
    // const [desc, setDesc] = useState("");
    // const [imageUrl, setImageUrl] = useState("");

    function getDate() {
        var date = new Date(createdAt)
        var formatted = format(date, "dd MMM yyyy")

        return formatted
    }

    function getTime() {
        var date = new Date(createdAt)
        var formatted = format(date, "hh:mm a")

        return formatted
    }

    async function getAuthorName(uid: string) {
        const user = await getUserNameByID(uid);
        setUsername(user!);

        console.log("Image URL :", imageUrl)
    }

    useEffect(() => {
        getAuthorName(author!);

        const connection = onAuthStateChanged(clientAuth, (user) => {
            if (user) {
                setUser(user);
            }
        });

        return connection;
    }, []);

    async function deleteButton() {
        await deletePost(id);
        alert("Post has been deleted!");
        location.reload();
    }

    async function editDialogButton() {
        const dialogModal = document.getElementById(`dialog-${id}`) as HTMLDialogElement;
        dialogModal.showModal();
    }

    if (username == "") {
        return (
            <div className="flex flex-col gap-2 lg:w-[30%] w-[65%]">
                <div className="flex flex-col gap-1">
                    <div className="skeleton h-[23px] w-[100px] rounded-none"></div>
                    <div className="skeleton h-[10px] w-[150px] rounded-none"></div>
                    <div className="skeleton h-[16px] w-full rounded-none"></div>
                    <div className="skeleton h-[58px] w-full rounded-none"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 lg:w-[30%] w-[65%]">

            <dialog id={`dialog-${id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Post</h3>

                    <EditPostForm id={id} />

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>

                </div>
            </dialog>

            <div>
                <div className="flex justify-between">
                    <h4 className="font-bold">@{username}</h4>
                    {
                        user && user.uid == author && (
                            <div>
                                <button className="cursor-pointer" popoverTarget={`popover-${id}`}>
                                    <BsThreeDots />
                                </button>
                                <ul className="dropdown dropdown-end menu w-32 rounded-box bg-gray-900 shadow-sm"
                                    popover="hint" id={`popover-${id}`}>
                                    <li><button onClick={editDialogButton}>Edit</button></li>
                                    <li><button onClick={deleteButton} className="text-red-600">Delete</button></li>
                                </ul>
                            </div>
                        )
                    }

                </div>
                <p className="text-[12px] flex gap-1 items-center text-gray-500">
                    {getDate()}
                    <GoDotFill />
                    {getTime()}
                </p>
            </div>

            {
                imageUrl && <Image className="rounded-xl border border-[#ffffff]"
                    urlEndpoint="https://ik.imagekit.io/0v2biakjo" // New prop
                    src={imageUrl}
                    width={500}
                    height={500}
                    alt={`Post by ${author}`} />
            }

            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-[14px] font-bold">{title}</h2>
                <p className="text-[12px] text-gray-300">
                    {
                        !isFull && desc.length >= 150 ? (
                            <>
                                {desc.slice(0, 150)}...
                                <button className="font-bold ml-[3px] cursor-pointer text-gray-500"
                                    onClick={() => { setIsFull(true) }}>
                                    more
                                </button>
                            </>
                        ) : desc
                    }
                    {
                        isFull && <>
                            {desc}
                            <br />
                            <button className="font-bold mt-[3px] cursor-pointer text-gray-500"
                                onClick={() => { setIsFull(false) }}>
                                show less
                            </button>
                        </>
                    }
                </p>
            </div>
        </div>
    );
}