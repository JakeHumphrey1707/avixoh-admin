"use client";

import { Colour } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
      message: "Color must be in hex format",
    }),
});

type ColourFormValues = z.infer<typeof formSchema>;

interface ColourFormProps {
    initialData: Colour | null;
}

export const ColourForm: React.FC<ColourFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit colour" : "Create colour";
    const description = initialData ? "Edit a colour" : "Add a new colour";
    const toastMessage = initialData ? "Colour updated" : "Colour created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColourFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit = async (data: ColourFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colours/${params.colourId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/colours`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colours`)
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
            await axios.delete(`/api/${params.storeId}/colours/${params.colourId}`);
            router.refresh();
            router.push(`/${params.storeId}/colours`);
            toast.success("Colour deleted");
        } catch (error) {
            toast.error("Make sure to remove all products using this colour first");
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colour</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Colour name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                      <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="#Hex value (eg. #ff0000)" {...field}/>
                                        <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }}/>
                                      </div>
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