import prismadb from "@/lib/prismadb";

export const getArchivedCount = async (storeId: string) => {
  const archivedCount = await prismadb.product.count({
    where: {
          storeId,
          
        },
  });

  return archivedCount;
}