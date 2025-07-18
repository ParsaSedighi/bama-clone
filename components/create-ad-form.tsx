"use client";

import type { Brand } from "@prisma/client";
import { useActionState } from "react";
import { createAdvertisement } from "@/app/actions/advertisementActions";
import { Button } from "@/components/ui/button";

function SubmitButton() {
    return <Button type="submit">Post Advertisement</Button>;
}

export function CreateAdForm({ brands }: { brands: Brand[] }) {
    const [state, formAction] = useActionState(createAdvertisement, null);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">Brand</label>
                <select
                    id="brandId"
                    name="brandId"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>
                {state?.errors?.brandId && <p className="text-sm text-red-500 mt-1">{state.errors.brandId[0]}</p>}
            </div>

            <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                {state?.errors?.model && <p className="text-sm text-red-500 mt-1">{state.errors.model[0]}</p>}
            </div>

            <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                <input
                    type="text"
                    id="color"
                    name="color"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                {state?.errors?.color && <p className="text-sm text-red-500 mt-1">{state.errors.color[0]}</p>}
            </div>

            <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                <select
                    id="condition"
                    name="condition"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
                {state?.errors?.condition && <p className="text-sm text-red-500 mt-1">{state.errors.condition[0]}</p>}
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="0.01"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                {state?.errors?.price && <p className="text-sm text-red-500 mt-1">{state.errors.price[0]}</p>}
            </div>

            <SubmitButton />
            {state?.error && <p className="text-sm text-red-500 mt-2">{state.error}</p>}
        </form>
    );
}