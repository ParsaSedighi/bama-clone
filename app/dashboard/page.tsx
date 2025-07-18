import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMyAdvertisements } from "@/app/actions/advertisementActions";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }

    const { success, data: myAds } = await getMyAdvertisements();

    if (!success) {
        return <p className="container mx-auto py-8">Could not load your advertisements.</p>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <Button asChild>
                    <Link href="/ads/create">Post New Ad</Link>
                </Button>
            </div>

            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">My Advertisements</h2>

            {myAds && myAds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myAds.map((ad) => (
                        <Link href={`/ad/${ad.id}`} key={ad.id}>
                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <CardTitle>{`${ad.car.brand.name} ${ad.car.model}`}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p><strong>Price:</strong> ${ad.price.toLocaleString()}</p>
                                    <p><strong>Condition:</strong> {ad.car.condition}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>You haven't posted any advertisements yet.</p>
            )}
        </main>
    );
}