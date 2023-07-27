"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Check, X } from "lucide-react"

export type ProductColumn = {
  id: string
  name: string
  price: string;
  weight: string;
  category: string;
  brand: string;
  colour: string;
  isFeatured: boolean;
  isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (row.original.isArchived ? <Check name="tick" color="green" /> : <X name="cross" color="red" />),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.original.isFeatured ? <Check name="tick" color="green" /> : <X name="cross" color="red" />),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "colour",
    header: "Colour",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colour}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.colour }}/>
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
