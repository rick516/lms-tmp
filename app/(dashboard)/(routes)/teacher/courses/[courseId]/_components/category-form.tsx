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
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
	initialData: Course;
	courseId: string;
	options: { label: string; value: string }[];
}

const formSchema = z.object({
	categoryId: z.string().min(1, { message: "category is required" })
});

export const CategoryForm = ({
	initialData,
	courseId,
	options
}: CategoryFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);
	

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { 
			categoryId: initialData?.categoryId || ""
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

	const selectedOption = options.find((option) => option.value === initialData.categoryId);

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course category
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn(
					"text-sm mt-2",
					!initialData.categoryId && "text-slate-500 italic"
				)}>
					{selectedOption?.label || "No category provided"}
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
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox
											options={...options}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										In which categories will you provide your course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button
								// onClick={toggleEdit}
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