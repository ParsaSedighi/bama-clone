import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "./ui/button";
import { SignOutButton } from "./signout-button";

export async function UserNav() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

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