import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } } 
) {
    try {

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                weight: true,
                brand: true,
                colour: true,
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } } 
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { 
          name,
          price,
          colourId,
          description,
          categoryId,
          weightId,
          brandId,
          images,
          isFeatured,
          isArchived
        } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!name) {
          return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!colourId) {
            return new NextResponse("Colour id is required", { status: 400 });
        }

        if (!description) {
          return new NextResponse("Description is required", { status: 400 });
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

        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                description,
                colourId,
                categoryId,
                weightId,
                brandId,
                images: {
                  deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
          where: {
            id: params.productId,
          },
          data: {
            images: {
              createMany: {
                data: [
                  ...images.map((image: { url: string }) => image),
                ]
              }
            }
          }
        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
