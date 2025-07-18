"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { SignOutButton } from "./signout-button";

export function UserNav() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <header className="border-b">
                <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <Link href="/" className="font-bold text-xl">
                        Car Market
                    </Link>
                    <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
                </nav>
            </header>
        );
    }

    return (
        <header className="border-b">
            <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl">
                    Car Market
                </Link>
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <Button asChild variant="ghost">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <span className="text-sm">Welcome, {session.user.name}</span>
                            <SignOutButton />
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}