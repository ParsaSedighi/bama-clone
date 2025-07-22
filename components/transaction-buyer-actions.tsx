"use client";

import { Button } from "@/components/ui/button";

interface TransactionBuyerActionsProps {
    transactionStatus: string;
    completeAction: () => Promise<void>;
}

export function TransactionBuyerActions({
    transactionStatus,
    completeAction,
}: TransactionBuyerActionsProps) {

    // Only show this button if the seller has accepted the offer
    if (transactionStatus !== "ACCEPTED") {
        return null;
    }

    return (
        <div className="mt-4">
            <form action={completeAction}>
                <Button type="submit" size="sm" className="w-full">
                    Confirm and Finalize Purchase
                </Button>
            </form>
        </div>
    );
}