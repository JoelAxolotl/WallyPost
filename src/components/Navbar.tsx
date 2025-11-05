"use client"

import { clientAuth, signOutUser } from "@/lib/client/firebaseClient";
import { onAuthStateChanged, User } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCompass, BiLogOut, BiPlus } from "react-icons/bi";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        const authConnection = onAuthStateChanged(clientAuth, (user) => {
            if (user) {
                setUser(user);
            }
        });

        return authConnection
    }, []);

    return (
        <header >
            <div className="container mx-auto p-3 flex lg:justify-between justify-center">
                <div className="items-center lg:flex hidden">
                    <h3 className="font-bold text-2xl">WallyPost</h3>
                </div>

                <nav className="flex gap-3 items-center">
                    <a className="btn btn-sm btn-accent" href="/">
                        <BiCompass fontSize={20} />
                        Discovery
                    </a>

                    {
                        !user && (
                            <div className="flex gap-3 items-center">
                                <a className="btn btn-sm btn-primary" href="/signin">Sign In</a>
                                <a className="btn btn-sm btn-secondary" href="/signup">Sign Up</a>
                            </div>
                        )
                    }
                    {
                        user && (
                            <div className="flex gap-3 items-center">
                                <a className="btn btn-sm btn-primary" href="/upload">
                                    <BiPlus fontSize={20} />
                                    Upload
                                </a>

                                <button className="btn btn-sm btn-secondary"
                                    onClick={async () => { await signOutUser(); router.replace("/signin"); }}>
                                    <BiLogOut fontSize={20} />
                                    Sign Out
                                </button>
                            </div>
                        )
                    }
                </nav>
            </div>
        </header >
    );
}