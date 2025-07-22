import { getAdvertisementById, deleteAdvertisement } from "@/app/actions/advertisementActions";
import { notFound } from "next/navigation";
import { RelatedAds } from "@/components/related-ads";
import { BuyRequestButton } from "@/components/buy-request-button";
import { DeleteAdButton } from "@/components/delete-ad-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const [adResult, session] = await Promise.all([
        getAdvertisementById(id),
        auth.api.getSession({ headers: await headers() }),
    ]);

    const { success, data: ad } = adResult;
    if (!success || !ad) {
        notFound();
    }

    const showBuyButton = session && session.user.id !== ad.user.id && !ad.transaction;
    const userIsAdmin = session?.user?.role === "admin" || session?.user?.role === "superuser";

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div> {/* Image Section */}
                    {ad.images && ad.images.length > 0 ? <img src={ad.images[0].url} alt={`${ad.car.brand.name} ${ad.car.model}`} className="w-full h-auto rounded-lg shadow-lg" /> : <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"><span className="text-gray-500">No Image Available</span></div>}
                </div>
                <div> {/* Details Section */}
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-bold mb-2">{`${ad.car.brand.name} ${ad.car.model}`}</h1>
                        {/* Show delete button for admins */}
                        {userIsAdmin && (
                            <DeleteAdButton deleteAction={deleteAdvertisement.bind(null, ad.id)} />
                        )}
                    </div>
                    <p className="text-3xl text-blue-600 font-semibold mb-6">${ad.price.toLocaleString()}</p>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Car Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Brand:</strong> {ad.car.brand.name}</p>
                            <p><strong>Model:</strong> {ad.car.model}</p>
                            <p><strong>Color:</strong> {ad.car.color}</p>
                            <p><strong>Condition:</strong> <span className="capitalize">{ad.car.condition}</span></p>
                        </div>
                        <h2 className="text-xl font-semibold border-b pb-2 mt-6">Seller Information</h2>
                        <div>
                            <p><strong>Name:</strong> {ad.user.name}</p>
                            <p><strong>Contact:</strong> {ad.user.email}</p>
                        </div>
                    </div>
                    {showBuyButton && <BuyRequestButton advertisementId={ad.id} />}
                    {ad.transaction && (
                        <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                            A transaction for this vehicle is currently in progress (Status: {ad.transaction?.status}).
                        </div>
                    )}
                </div>
            </div>
            <RelatedAds brandId={ad.car.brandId} currentAdId={ad.id} />
        </main>
    );
}