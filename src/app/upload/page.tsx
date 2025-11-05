"use client";

import Navbar from "@/components/Navbar";
import { clientAuth, postContent } from "@/lib/client/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillCloudFill } from "react-icons/bs";

export default function UploadPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");

    async function uploadHandler(e: React.FormEvent) {
        e.preventDefault();

        try {
            await postContent(title, caption);
            setCaption("");
            setTitle("");

            alert("Uploaded!");

            router.replace("/");
        } catch (e) {
            alert(e);
        }
    }

    useEffect(() => {
        const authConnection = onAuthStateChanged(clientAuth, (user) => {
            if (user) {
                setUser(user);
            } else {
                redirect("/");
            }
        });

        return authConnection
    }, []);

    return (
        <main>
            <Navbar />

            <section className="p-5 mt-[60px]">
                <div className="container mx-auto">
                    <form onSubmit={uploadHandler} className="lg:w-[50%] mx-auto flex flex-col gap-4 items-center bg-gray-800 py-[60px] rounded-xl">

                        <div className="mb-[30px] w-[60%] mx-auto">
                            <h2 className="text-2xl font-bold">Post Now</h2>
                            <p>Upload your creative post and share it to others!</p>
                        </div>

                        <div className="relative w-[60%] mx-auto">
                            <input className="input input-accent w-full" type="text" placeholder="Title" required
                                value={title} onChange={(e) => { setTitle(e.target.value); }} />
                        </div>

                        <div className="relative w-[60%] mx-auto">
                            <textarea className="textarea textarea-accent w-full h-[150px] resize-none" placeholder="Caption Here!" required
                                value={caption} onChange={(e) => { setCaption(e.target.value); }} ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary mt-[30px]">
                            Upload
                            <BsFillCloudFill />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

function setUser(user: any) {
    throw new Error("Function not implemented.");
}
