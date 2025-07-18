"use client";

import { Button } from "@/components/ui/button";

interface TransactionSellerActionsProps {
    transactionId: string;
    transactionStatus: string;
    acceptAction: () => Promise<void>;
    rejectAction: () => Promise<void>;
}

export function TransactionSellerActions({
    transactionId,
    transactionStatus,
    acceptAction,
    rejectAction,
}: TransactionSellerActionsProps) {

    if (transactionStatus !== "PENDING") {
        return null;
    }

    return (
        <div className="flex items-center gap-2 mt-4">
            <form action={acceptAction}>
                <Button type="submit" size="sm">Accept</Button>
            </form>
            <form action={rejectAction}>
                <Button type="submit" size="sm" variant="destructive">Reject</Button>
            </form>
        </div>
    );
}