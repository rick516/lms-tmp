"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	price: z.coerce.number(),
});

export const PriceForm = ({
	initialData, courseId
}: PriceFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);


	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: initialData?.price || 0,
		}
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast.success("Course updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course price
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit price
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn(
					"text-sm mt-2",
					!initialData.price && "text-slate-500 italic"
				)}>
					{initialData.price ? formatPrice(initialData.price) : "No price provided"}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="Set a price for your course"
											disabled={isSubmitting}
											{...field}
											value={field.value || undefined}
										/>
									</FormControl>
									<FormDescription>
										How much is your course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button
								type="button"
								disabled={!isValid || isSubmitting}
								variant="ghost"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!isValid || isSubmitting}
								variant="default"
							>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}