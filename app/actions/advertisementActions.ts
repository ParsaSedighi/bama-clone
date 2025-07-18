"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";



export type SearchFilters = {
    brandId?: number;
    color?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
};

const AdSchema = z.object({
    brandId: z.coerce.number().min(1, "Brand is required."),
    model: z.string().min(2, "Model is required."),
    color: z.string().min(2, "Color is required."),

    condition: z.enum(["new", "used"], {
        message: "Please select a valid condition.",
    }),

    price: z.coerce.number().min(1, "Price must be a positive number."),
});

export async function createAdvertisement(previousState: any, formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { success: false, error: "You must be logged in to post an ad." };
    }

    const validatedFields = AdSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            error: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    const { brandId, model, color, condition, price } = validatedFields.data;

    try {
        const newAd = await db.$transaction(async (tx: Prisma.TransactionClient) => {
            const newCar = await tx.car.create({
                data: {
                    brandId,
                    model,
                    color,
                    condition,
                },
            });

            const newAdvertisement = await tx.advertisement.create({
                data: {
                    price,
                    carId: newCar.id,
                    userId: session.user.id,
                },
            });

            return newAdvertisement;
        });
    } catch (error) {
        console.error("Failed to create advertisement:", error);
        return { success: false, error: "Database error: Failed to create advertisement." };
    }

    redirect("/");
}

export async function searchAdvertisements(filters: SearchFilters) {
    try {
        const { brandId, color, condition, minPrice, maxPrice } = filters;

        const whereClause: any = {
            AND: [],
        };


        // Filter by price range 
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceFilter: { gte?: number; lte?: number } = {};
            if (minPrice !== undefined) priceFilter.gte = minPrice;
            if (maxPrice !== undefined) priceFilter.lte = maxPrice;
            whereClause.AND.push({ price: priceFilter });
        }

        // Filter by brand 
        if (brandId) {
            whereClause.AND.push({ car: { brandId: brandId } });
        }

        // Filter by color 
        if (color) {
            whereClause.AND.push({ car: { color: { contains: color, mode: "insensitive" } } });
        }

        // Filter by car condition (new or used) 
        if (condition) {
            whereClause.AND.push({ car: { condition: condition } });
        }

        // If no filters are applied, the AND array will be empty, returning all ads.

        const advertisements = await db.advertisement.findMany({
            where: whereClause,
            include: {
                car: {
                    include: {
                        brand: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                _count: {
                    select: { images: true }
                }
            },
            orderBy: {
                createdAt: 'desc', // Show newest ads first
            }
        });

        return { success: true, data: advertisements };
    } catch (error) {
        console.error("Error searching advertisements:", error);
        return { success: false, error: "An error occurred during the search." };
    }
}


// Action to fetch all car brands for the search form dropdown
export async function getBrands() {
    try {
        const brands = await db.brand.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return { success: true, data: brands };
    } catch (error) {
        console.error("Error fetching brands:", error);
        return { success: false, error: "An error occurred fetching brands." };
    }
}

export async function getAdvertisementById(id: string) {
    try {
        const advertisement = await db.advertisement.findUnique({
            where: { id },
            include: {
                car: {
                    include: {
                        brand: true, // Include the car's brand
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                images: true,
            },
        });

        if (!advertisement) {
            return { success: false, error: "Advertisement not found." };
        }

        return { success: true, data: advertisement };
    } catch (error) {
        console.error("Error fetching advertisement:", error);
        return { success: false, error: "An error occurred fetching the advertisement." };
    }
}


export async function getRelatedAdvertisements(brandId: number, currentAdId: string) {
    try {
        const relatedAds = await db.advertisement.findMany({
            where: {
                car: {
                    brandId: brandId,
                },
                id: {
                    not: currentAdId,
                },
            },
            take: 3,
            include: {
                car: {
                    include: {
                        brand: true,
                    },
                },
            },
        });

        return { success: true, data: relatedAds };
    } catch (error) {
        console.error("Error fetching related advertisements:", error);
        return { success: false, error: "An error occurred fetching related ads." };
    }
}

