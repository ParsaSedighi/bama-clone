import Link from "next/link";
import { getRelatedAdvertisements } from "@/app/actions/advertisementActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedAdsProps {
    brandId: number;
    currentAdId: string;
}

export async function RelatedAds({ brandId, currentAdId }: RelatedAdsProps) {
    const { success, data: relatedAds } = await getRelatedAdvertisements(
        brandId,
        currentAdId
    );

    if (!success || !relatedAds || relatedAds.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Advertisements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedAds.map((ad) => (
                    <Link href={`/ad/${ad.id}`} key={ad.id}>
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle>{`${ad.car.brand.name} ${ad.car.model}`}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Price:</strong> ${ad.price.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}