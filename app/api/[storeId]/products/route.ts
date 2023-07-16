import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { 
          name,
          price,
          categoryId,
          weightId,
          brandId,
          images,
          isFeatured,
          isArchived
        } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
      
        if (!categoryId) {
        return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!weightId) {
          return new NextResponse("Weight ID is required", { status: 400 });
        }

        if (!brandId) {
          return new NextResponse("Brand ID is required", { status: 400 });
        }

        if (!images || !images.length) {
          return new NextResponse("Image(s) required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                weightId,
                brandId,
                isArchived,
                isFeatured,
                storeId: params.storeId,
                images: {
                  createMany: {
                    data: [
                      ...images.map((image: { url: string }) => image)
                    ]
                  }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const brandId = searchParams.get("brandId") || undefined;
        const weightId = searchParams.get("weightId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: { 
              storeId: params.storeId,
              categoryId,
              brandId,
              weightId,
              isFeatured: isFeatured ? true : undefined,
              isArchived: false      
             },
             include: {
              images: true,
              category: true,
              weight: true,
              brand: true
             },
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};