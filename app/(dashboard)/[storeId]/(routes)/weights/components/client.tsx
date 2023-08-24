"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { WeightColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface WeightsClientProps {
    data: WeightColumn[]
}

export const WeightsClient: React.FC<WeightsClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
            <>
                <div className="flex items-center justify-between">
                    <Heading 
                        title={`Weights / Bodyshapes (${data.length})`}
                        description="Manage weight and bodyshape filters for your store"
                    />
                    <Button onClick={() => router.push(`/${params.storeId}/weights/new`)}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add new
                    </Button>
                </div>
                <Separator />
                <DataTable searchKey="name" columns={columns} data={data} />
                <Heading title="API" description="API calls for weights"/>
                <Separator />
                <ApiList entityName="weights" entityIdName="weightId" />
            </>
        )
}