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
import { Chapter } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
	initialData, courseId, chapterId
}: ChapterAccessFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);


	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
		}
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
			toast.success("Chapter updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter Access
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit access
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div className={cn(
					"text-sm mt-2",
					!initialData.isFree && "text-slate-500 italic"
				)}>
					{initialData.isFree ? (
						<p>This chapter is free for preview.</p>
					) : (
						<p>This chapter is not free.</p>
					)}
				</div>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this chapter free.
										</FormDescription>
									</div>
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