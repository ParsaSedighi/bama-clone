import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBrands } from "@/app/actions/advertisementActions";

import { CreateAdForm } from "@/components/create-ad-form";

export default async function CreateAdPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    const { data: brands } = await getBrands();

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Post a New Advertisement</h1>
                <CreateAdForm brands={brands || []} />
            </div>
        </main>
    );
}