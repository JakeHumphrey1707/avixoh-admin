"use client";

import { Product, Image, Category, Weight, Brand, Colour } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price:  z.coerce.number().min(1),
    description: z.string().min(1),
    categoryId: z.string().min(1),
    weightId: z.string().min(1),
    brandId: z.string().min(1),
    colourId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
      images: Image[]
    } | null;
    categories: Category[];
    weights: Weight[];
    brands: Brand[];
    colours: Colour[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    weights,
    brands,
    colours,
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated" : "Product created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            description: '',
            categoryId: '',
            weightId: '',
            brandId: '',
            colourId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && ( 
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField 
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value.map((image) => image.url)}
                                            disabled={loading}
                                            onChange={(url) => field.onChange([...field.value, { url }])}
                                            onRemove={(url) => field.onChange([...field.value.filter((current) => current.url!== url)])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name/Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product title" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="$0.00" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
          
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                      <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue 
                                               defaultValue={field.value} placeholder="Select a category"
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {categories.map((category) => (
                                            <SelectItem
                                              key={category.id}
                                              value={category.id}
                                            >
                                              {category.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="weightId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight</FormLabel>
                                      <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue 
                                               defaultValue={field.value} placeholder="Select a weight"
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {weights.map((weight) => (
                                            <SelectItem
                                              key={weight.id}
                                              value={weight.id}
                                            >
                                              {weight.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="brandId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                      <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue 
                                               defaultValue={field.value} placeholder="Select a brand"
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {brands.map((brand) => (
                                            <SelectItem
                                              key={brand.id}
                                              value={brand.id}
                                            >
                                              {brand.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colourId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colour</FormLabel>
                                      <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue 
                                               defaultValue={field.value} placeholder="Select a colour"
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {colours.map((colour) => (
                                            <SelectItem
                                              key={colour.id}
                                              value={colour.id}
                                            >
                                              {colour.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox 
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Featured</FormLabel>
                                      <FormDescription>
                                        Product will be visisble on the landing page
                                      </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox 
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Backorder</FormLabel>
                                      <FormDescription>
                                        Product will be on "backorder" and will not appear anywhere in the store. &#40;This is automatically applied after a purchase.&#41;
                                      </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea maxLength={999} rows={10} cols={1} disabled={loading} placeholder="Product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    ); 
};