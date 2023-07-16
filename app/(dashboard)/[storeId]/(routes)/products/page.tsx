import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatters } from "@/lib/utils";

const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            brand: true,
            weight: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

const formattedProducts: ProductColumn[] = products.map((item) => ({
  id: item.id,
  name: item.name,
  isFeatured: item.isFeatured,
  isArchived: item.isArchived,
  price: formatters.format(item.price.toNumber()),
  quantity: item.quantity,
  category: item.category.name,
  brand: item.brand.name,
  weight: item.weight.name,
}) )

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
     );
};
 
export default ProductsPage;