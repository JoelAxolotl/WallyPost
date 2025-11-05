"use client"

import Navbar from "@/components/Navbar";
import { clientAuth, signUpEmail } from "@/lib/client/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail, MdPassword } from "react-icons/md";

export default function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const authConnection = onAuthStateChanged(clientAuth, (user) => {
            if (user) {
                setUser(user);
                redirect("/");
            }
        });

        return authConnection
    }, []);

    async function authFormHandler(e: React.FormEvent) {
        e.preventDefault();

        console.log("Username :", username)
        console.log("Email :", email)
        console.log("Password :", password)

        try {
            await signUpEmail(username, email, password);
            router.replace("/");
        } catch (e) {
            alert(e);
        }
    }

    return (
        <main>
            <Navbar />

            <section className="p-5 mt-[60px]">
                <div className="container mx-auto">

                    <form onSubmit={authFormHandler} className="sm:w-[80%] lg:w-[50%] mx-auto flex flex-col gap-4 items-center bg-gray-800 py-[60px] rounded-xl">
                        <div className="mb-[30px] w-[50%] mx-auto">
                            <h2 className="text-2xl font-bold">Sign Up</h2>
                            <p>Create your account and start posting now!</p>
                        </div>

                        <div className="relative w-[50%] mx-auto">
                            <IoPersonSharp className="absolute z-10 left-2.5 top-2.5" />
                            <input className="input input-accent pl-[32px]" type="text" placeholder="Username" required
                                onChange={(e) => { setUsername(e.target.value); }} />
                        </div>

                        <div className="relative w-[50%] mx-auto">
                            <MdEmail className="absolute z-10 left-2.5 top-2.5" />
                            <input className="input input-accent pl-[32px]" type="email" placeholder="Email" required
                                onChange={(e) => { setEmail(e.target.value); }} />
                        </div>

                        <div className="relative w-[50%] mx-auto">
                            <MdPassword className="absolute z-10 left-2.5 top-2.5" />
                            <input className="input input-accent pl-[32px]" type="password" placeholder="Password" required
                                onChange={(e) => { setPassword(e.target.value); }} />
                        </div>

                        <button type="submit" className="btn btn-primary mt-[30px]">
                            Create Account
                            <FaChevronCircleRight />
                        </button>
                    </form>

                </div>
            </section>
        </main>
    );
}