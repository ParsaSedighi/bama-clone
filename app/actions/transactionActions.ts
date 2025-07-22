"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function completeTransaction(transactionId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        console.error("Error: Not authenticated.");
        return;
    }

    try {
        const transaction = await db.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction) {
            console.error("Error: Transaction not found.");
            return;
        }

        if (transaction.buyerId !== session.user.id) {
            console.error("Error: Unauthorized.");
            return;
        }

        // A transaction can only be completed if it has been accepted first
        if (transaction.status !== "ACCEPTED") {
            console.error("Error: Transaction is not in an accepted state.");
            return;
        }

        await db.transaction.update({
            where: { id: transactionId },
            data: { status: "COMPLETED" },
        });

        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Database error in completeTransaction:", error);
    }
}

export async function acceptTransaction(transactionId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) { console.error("Error: Not authenticated."); return; }
    try {
        const transaction = await db.transaction.findUnique({ where: { id: transactionId }, include: { advertisement: { select: { userId: true } } } });
        if (!transaction) { console.error("Error: Transaction not found."); return; }
        if (transaction.advertisement.userId !== session.user.id) { console.error("Error: Unauthorized."); return; }
        await db.transaction.update({ where: { id: transactionId }, data: { status: "ACCEPTED" } });
        revalidatePath("/dashboard");
    } catch (error) { console.error("Database error in acceptTransaction:", error); }
}

export async function rejectTransaction(transactionId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) { console.error("Error: Not authenticated."); return; }
    try {
        const transaction = await db.transaction.findUnique({ where: { id: transactionId }, include: { advertisement: { select: { userId: true } } } });
        if (!transaction) { console.error("Error: Transaction not found."); return; }
        if (transaction.advertisement.userId !== session.user.id) { console.error("Error: Unauthorized."); return; }
        await db.transaction.update({ where: { id: transactionId }, data: { status: "REJECTED" } });
        revalidatePath("/dashboard");
    } catch (error) { console.error("Database error in rejectTransaction:", error); }
}

export async function createTransaction(advertisementId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "You must be logged in." };
    try {
        const advertisement = await db.advertisement.findUnique({ where: { id: advertisementId } });
        if (!advertisement) return { success: false, error: "Advertisement not found." };
        if (advertisement.userId === session.user.id) return { success: false, error: "You cannot buy your own car." };
        const existingTransaction = await db.transaction.findFirst({ where: { advertisementId: advertisementId } });
        if (existingTransaction) return { success: false, error: "A transaction for this ad already exists." };
        await db.transaction.create({
            data: {
                agreedPrice: advertisement.price,
                status: "PENDING",
                advertisement: { connect: { id: advertisement.id } },
                buyer: { connect: { id: session.user.id } },
            },
        });
        revalidatePath(`/ad/${advertisementId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create transaction:", error);
        return { success: false, error: "Database error: Could not create transaction." };
    }
}

export async function getMySales() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Not authenticated." };
    return {
        success: true,
        data: await db.transaction.findMany({
            where: { advertisement: { userId: session.user.id } },
            include: {
                advertisement: { include: { car: { include: { brand: true } } } },
                buyer: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    };
}

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
                        user: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
    };
}