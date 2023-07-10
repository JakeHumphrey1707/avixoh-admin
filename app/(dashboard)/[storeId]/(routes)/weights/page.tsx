import prismadb from "@/lib/prismadb";
import { WeightsClient } from "./components/client";
import { WeightColumn } from "./components/columns";
import { format } from "date-fns";

const WeightsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const weights = await prismadb.weight.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

const formattedWeights: WeightColumn[] = weights.map((item) => ({
  id: item.id,
  name: item.name,
  value: item.value,
  createdAt: format(item.createdAt, "MMMM do, yyyy")
}) )

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <WeightsClient data={formattedWeights} />
            </div>
        </div>
     );
};
 
export default WeightsPage;