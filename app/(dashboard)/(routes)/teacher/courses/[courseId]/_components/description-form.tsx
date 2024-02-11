"use client";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface DescriptionFormProps {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	description: z.string().min(1, { message: "description is required" })
});

export const DescriptionForm = ({
	initialData, courseId
}: DescriptionFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);
	

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { 
			description: initialData?.description || ""
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
				Course description
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit description
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className={cn(
					"text-sm mt-2",
					!initialData.description && "text-slate-500 italic"
				)}>
					{initialData.description ? (
						<Preview value={initialData.description} />
					) : (
						"No description provided"
					)}
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="This course is about..."
											disabled={isSubmitting}
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this course?
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