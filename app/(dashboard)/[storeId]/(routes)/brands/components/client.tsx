"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BrandColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BrandsClientProps {
    data: BrandColumn[]
}

export const BrandsClient: React.FC<BrandsClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
            <>
                <div className="flex items-center justify-between">
                    <Heading 
                        title={`Brands (${data.length})`}
                        description="Manage brand filters for your store"
                    />
                    <Button onClick={() => router.push(`/${params.storeId}/brands/new`)}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add new
                    </Button>
                </div>
                <Separator />
                <DataTable searchKey="name" columns={columns} data={data} />
                <Heading title="API" description="API calls for brands"/>
                <Separator />
                <ApiList entityName="brands" entityIdName="brandId" />
            </>
        )
}