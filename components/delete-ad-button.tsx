"use client";

import { Button } from "./ui/button";

interface DeleteAdButtonProps {
    deleteAction: () => Promise<void>;
}

export function DeleteAdButton({ deleteAction }: DeleteAdButtonProps) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Show a confirmation dialog before proceeding
        const confirmed = window.confirm("Are you sure you want to delete this advertisement?");
        if (confirmed) {
            // If confirmed, find the form and submit it programmatically
            const form = e.currentTarget.closest('form');
            if (form) {
                form.requestSubmit();
            }
        }
    };

    return (
        <form action={deleteAction} className="inline-block">
            <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClick}
            >
                Delete
            </Button>
        </form>
    );
}