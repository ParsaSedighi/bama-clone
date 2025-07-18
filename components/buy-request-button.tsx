"use client";

import { createTransaction } from "@/app/actions/transactionActions";
import { Button } from "./ui/button";

interface BuyRequestButtonProps {
    advertisementId: string;
}

export function BuyRequestButton({ advertisementId }: BuyRequestButtonProps) {

    const handleBuyRequest = async () => {
        const result = await createTransaction(advertisementId);
        if (result.error) {
            alert(result.error);
        } else {
            alert("Purchase request sent!");
        }
    };

    return (
        <form action={handleBuyRequest}>
            <Button type="submit" className="w-full mt-6">
                Request to Buy
            </Button>
        </form>
    );
}