"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            // Redirect on success
            fetchOptions: {
                onSuccess: () => {
                    // Refresh the page to update the server-rendered UserNav component
                    router.refresh();
                },
            },
        });
    };

    return (
        <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
        </Button>
    );
}