import prismadb from "@/lib/prismadb";
import { WeightForm } from "./components/weight-form";

const WeightPage = async ({
    params
}: {
    params: { weightId: string }
}) => {
    const weight = await prismadb.weight.findUnique({
        where: {
            id: params.weightId
        }
    });

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <WeightForm initialData={weight}/>
            </div>
        </div>
     );
}
 
export default WeightPage;