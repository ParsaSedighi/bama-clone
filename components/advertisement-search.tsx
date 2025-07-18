"use client";

import { useState, useEffect, FormEvent } from "react";
import type { Brand } from "@prisma/client";
import { searchAdvertisements, getBrands } from "@/app/actions/advertisementActions";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AdvertisementResult = Awaited<ReturnType<typeof searchAdvertisements>>['data'];

export function AdvertisementSearch() {
    // State for form inputs
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const [condition, setCondition] = useState<string>("");

    // State for search results and loading status
    const [results, setResults] = useState<AdvertisementResult>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Fetch brands when the component mounts
    useEffect(() => {
        const fetchBrands = async () => {
            const { success, data } = await getBrands();
            if (success && data) {
                setBrands(data);
            }
        };
        fetchBrands();
    }, []);

    // Form submission handler
    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSearched(true);

        const filters = {
            brandId: selectedBrand ? parseInt(selectedBrand, 10) : undefined,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            color: color || undefined,
            condition: condition || undefined,
        };

        const { success, data } = await searchAdvertisements(filters);
        if (success && data) {
            setResults(data);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Car Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Brand Select */}
                        <Select onValueChange={setSelectedBrand} value={selectedBrand}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={String(brand.id)}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Price Inputs */}
                        <Input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        <Input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

                        {/* Color Input */}
                        <Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />

                        {/* Condition Select */}
                        <Select onValueChange={setCondition} value={condition}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button type="submit" disabled={isLoading} className="lg:col-span-3">
                            {isLoading ? "Searching..." : "Search"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results Section */}
            {searched && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Results</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : results && results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((ad) => (
                                <Link href={`/ad/${ad.id}`} key={ad.id}>
                                    <Card className="hover:shadow-lg transition-shadow duration-200">
                                        <CardHeader>
                                            <CardTitle>{`${ad.car.brand.name} ${ad.car.model || ''}`}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p><strong>Price:</strong> ${ad.price.toLocaleString()}</p>
                                            <p><strong>Condition:</strong> {ad.car.condition}</p>
                                            <p><strong>Color:</strong> {ad.car.color}</p>
                                            <p><strong>Seller:</strong> {ad.user.name}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No advertisements found matching your criteria.</p>
                    )}
                </div>
            )}
        </div>
    );
}