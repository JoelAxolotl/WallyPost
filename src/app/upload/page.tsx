"use client";

import Navbar from "@/components/Navbar";
import { clientAuth, postContent } from "@/lib/client/firebaseClient";
import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from "@imagekit/next";
import { onAuthStateChanged, User } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BsFillCloudFill } from "react-icons/bs";

export default function UploadPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    const [isDone, setIsDone] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");

    async function uploadHandler(e: React.FormEvent) {
        e.preventDefault();

        try {
            const uploadedImage = await uploadImage();

            await postContent(title, caption, uploadedImage);
            setCaption("");
            setTitle("");

            alert("Uploaded!");

            router.replace("/");
        } catch (e) {
            alert(e);
        }
    }

    async function fetchAuth() {
        try {
            const response = await fetch("/api/image-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    }

    async function uploadImage() {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return null;
        }

        setIsDone(false);

        const file = fileInput.files[0];

        let authParams;
        try {
            authParams = await fetchAuth();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            setIsDone(true);
            return null;
        }
        const { signature, expire, token, publicKey } = authParams;

        var filename = user?.uid + "-" + "img" + "-" + Date.now() + "-" + file.name;

        try {
            const uploadResponse = await upload({
                folder: "/uploads",
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: filename,
            });
            console.log("Upload response:", uploadResponse);
            setIsDone(true);

            console.log("Path :", uploadResponse.filePath);

            return uploadResponse.filePath;
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
            setIsDone(true);
            return null;
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

                        <div className="relative w-[60%] mx-auto flex flex-col gap-1">
                            <label>Share an Image</label>
                            <input type="file" accept="image/*" ref={fileInputRef} className="file-input file-input-accent w-full" />
                        </div>

                        {
                            !isDone && (
                                <div>
                                    <p>
                                        Uploading image please wait!
                                    </p>
                                </div>
                            )
                        }

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
