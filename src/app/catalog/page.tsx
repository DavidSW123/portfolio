import { prisma } from "@/lib/prisma";
import { CatalogClient } from "./catalog-client";

interface SearchParams {
  brand?: string; fuel?: string; transmission?: string;
  minPrice?: string; maxPrice?: string; minYear?: string; maxYear?: string;
  search?: string; page?: string;
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true, status: "PUBLISHED" };

  if (params.brand) where.brand = params.brand;
  if (params.fuel) where.fuelType = params.fuel;
  if (params.transmission) where.transmission = params.transmission;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { brand: { contains: params.search } },
      { model: { contains: params.search } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    where.finalPrice = {};
    if (params.minPrice) (where.finalPrice as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.finalPrice as Record<string, number>).lte = parseFloat(params.maxPrice);
  }
  if (params.minYear || params.maxYear) {
    where.year = {};
    if (params.minYear) (where.year as Record<string, number>).gte = parseInt(params.minYear);
    if (params.maxYear) (where.year as Record<string, number>).lte = parseInt(params.maxYear);
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { photos: { take: 1 } } }),
    prisma.car.count({ where }),
  ]);

  return (
    <CatalogClient
      cars={cars}
      total={total}
      page={page}
      totalPages={Math.ceil(total / limit)}
      params={params as Record<string, string | undefined>}
    />
  );
}
