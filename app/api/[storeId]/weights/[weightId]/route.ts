import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { weightId: string } } 
) {
    try {

        if (!params.weightId) {
            return new NextResponse("Weight id is required", { status: 400 });
        }

        const weight = await prismadb.weight.findUnique({
            where: {
                id: params.weightId,
            }
        });

        return NextResponse.json(weight);

    } catch (error) {
        console.log('[WEIGHT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, weightId: string } } 
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.weightId) {
            return new NextResponse("Weight id is required", { status: 400 });
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

        const weight = await prismadb.weight.updateMany({
            where: {
                id: params.weightId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(weight);

    } catch (error) {
        console.log('[WEIGHT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, weightId: string } } 
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.weightId) {
            return new NextResponse("Weight id is required", { status: 400 });
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

        const weight = await prismadb.weight.deleteMany({
            where: {
                id: params.weightId,
            }
        });

        return NextResponse.json(weight);

    } catch (error) {
        console.log('[WEIGHT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};