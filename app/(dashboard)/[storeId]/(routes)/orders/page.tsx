import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatters } from "@/lib/utils";

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

const totalOrders = orders.length;

const formattedOrders: OrderColumn[] = orders.map((item, index) => ({
  id: `Order #${(totalOrders - index).toString().padStart(0, "0")}`,
  phone: item.phone,
  address: item.address,
  products: item.orderItems
    .map(
      (orderItem) =>
        `${orderItem.product.name}`
    )
    .join(", "),
  createdAt: format(item.createdAt, "MMMM do, yyyy"),
}))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
     );
};
 
export default OrdersPage;