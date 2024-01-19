"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { MuxData } from "@prisma/client";

interface ChapterTitleFormProps {
	initialData: {
		title: string;
		muxData?: MuxData | null;
	};
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	title: z.string().min(1, { message: "Title is required" })
});

export const ChapterTitleForm = ({
	initialData, courseId, chapterId
}: ChapterTitleFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);
	

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
				Chapter Title
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit Title
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p className="text-sm mt-2">{initialData.title}</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Chapter Title"
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this chapter?
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