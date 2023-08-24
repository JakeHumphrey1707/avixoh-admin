"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColourColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ColoursClientProps {
    data: ColourColumn[]
}

export const ColoursClient: React.FC<ColoursClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
            <>
                <div className="flex items-center justify-between">
                    <Heading 
                        title={`Colours / Genders (${data.length})`}
                        description="Manage colour and gender filters for your store"
                    />
                    <Button onClick={() => router.push(`/${params.storeId}/colours/new`)}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add new
                    </Button>
                </div>
                <Separator />
                <DataTable searchKey="name" columns={columns} data={data} />
                <Heading title="API" description="API calls for colours"/>
                <Separator />
                <ApiList entityName="colours" entityIdName="colourId" />
            </>
        )
}