import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getMyAdvertisements } from "@/app/actions/advertisementActions";
import { getMySales, getMyPurchases, acceptTransaction, rejectTransaction, completeTransaction } from "@/app/actions/transactionActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionSellerActions } from "@/components/transaction-seller-actions";
import { TransactionBuyerActions } from "@/components/transaction-buyer-actions";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const [adsResult, salesResult, purchasesResult] = await Promise.all([
        getMyAdvertisements(),
        getMySales(),
        getMyPurchases(),
    ]);

    const { data: myAds } = adsResult;
    const { data: mySales } = salesResult;
    const { data: myPurchases } = purchasesResult;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <Button asChild>
                    <Link href="/ads/create">Post New Ad</Link>
                </Button>
            </div>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4">My Advertisements</h2>
                {myAds && myAds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myAds.map((ad) => (
                            <Link href={`/ad/${ad.id}`} key={ad.id}>
                                <Card className="hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader><CardTitle>{`${ad.car.brand.name} ${ad.car.model}`}</CardTitle></CardHeader>
                                    <CardContent><p><strong>Price:</strong> ${ad.price.toLocaleString()}</p><p><strong>Condition:</strong> {ad.car.condition}</p></CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : <p>You haven't posted any advertisements yet.</p>}
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Incoming Sale Requests</h2>
                {mySales && mySales.length > 0 ? (
                    <div className="space-y-4">
                        {mySales.map((sale) => (
                            <Card key={sale.id}>
                                <CardHeader><CardTitle>{`${sale.advertisement.car.brand.name} ${sale.advertisement.car.model}`}</CardTitle></CardHeader>
                                <CardContent>
                                    <p><strong>Buyer:</strong> {sale.buyer.name}</p>
                                    <p><strong>Status:</strong> {sale.status}</p>
                                    <TransactionSellerActions
                                        transactionId={sale.id}
                                        transactionStatus={sale.status}
                                        acceptAction={acceptTransaction.bind(null, sale.id)}
                                        rejectAction={rejectTransaction.bind(null, sale.id)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : <p>You have no incoming sale requests.</p>}
            </section>

            <section>
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4">My Purchase Requests</h2>
                {myPurchases && myPurchases.length > 0 ? (
                    <div className="space-y-4">
                        {myPurchases.map((purchase) => (
                            <Card key={purchase.id}>
                                <CardHeader><CardTitle>{`${purchase.advertisement.car.brand.name} ${purchase.advertisement.car.model}`}</CardTitle></CardHeader>
                                <CardContent>
                                    <p><strong>Seller:</strong> {purchase.advertisement.user.name}</p>
                                    <p><strong>Status:</strong> {purchase.status}</p>
                                    <TransactionBuyerActions
                                        transactionStatus={purchase.status}
                                        completeAction={completeTransaction.bind(null, purchase.id)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : <p>You have no active purchase requests.</p>}
            </section>
        </main>
    );
}