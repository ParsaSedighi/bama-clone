"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createTransaction(advertisementId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { success: false, error: "You must be logged in." };
    }

    try {
        const advertisement = await db.advertisement.findUnique({
            where: { id: advertisementId },
        });

        if (!advertisement) {
            return { success: false, error: "Advertisement not found." };
        }

        if (advertisement.userId === session.user.id) {
            return { success: false, error: "You cannot buy your own car." };
        }

        const existingTransaction = await db.transaction.findFirst({
            where: { advertisementId: advertisementId },
        });

        if (existingTransaction) {
            return { success: false, error: "A transaction for this ad already exists." };
        }

        await db.transaction.create({
            data: {
                agreedPrice: advertisement.price,
                status: "PENDING",
                advertisement: {
                    connect: { id: advertisement.id },
                },
                buyer: {
                    connect: { id: session.user.id },
                },
            },
        });

        revalidatePath(`/ad/${advertisementId}`);
        return { success: true };

    } catch (error) {
        console.error("Failed to create transaction:", error);
        return { success: false, error: "Database error: Could not create transaction." };
    }
}

// Fetches sales where the logged-in user is the SELLER
export async function getMySales() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Not authenticated." };

    return {
        success: true,
        data: await db.transaction.findMany({
            where: { advertisement: { userId: session.user.id } },
            include: {
                advertisement: { include: { car: { include: { brand: true } } } },
                buyer: { select: { name: true } }, // The other person is the buyer
            },
            orderBy: { createdAt: 'desc' },
        }),
    };
}

// Fetches purchases where the logged-in user is the BUYER
export async function getMyPurchases() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Not authenticated." };

    return {
        success: true,
        data: await db.transaction.findMany({
            where: { buyerId: session.user.id },
            include: {
                advertisement: {
                    include: {
                        car: { include: { brand: true } },
                        user: { select: { name: true } }, // The other person is the seller
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
    };
}