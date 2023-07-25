"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center">
      <Heading
        title={`Orders (${data.length})`}
        description="View orders from your store, and go to the Stripe Dashboard"
      />
      <div>
        <a 
        href="https://dashboard.stripe.com/test/payments" 
        target="blank"
        className="underline underline-offset-8 font-bold text-2xl hover:text-muted-foreground duration-300"
        >
          GOTO STRIPE DASHBOARD
        </a>
      </div>
      </div>
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
}
