"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Course, Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
	initialData: Course & { chapters: Chapter[] };
	courseId: string;
}
const formSchema = z.object({
	title: z.string().min(1)
});

export const ChaptersForm = ({
	initialData, courseId
}: ChaptersFormProps) => {
	const router = useRouter()
	const [isCreating, setIsCreating] = useState(false);
	// const [isUpdating, setIsUpdating] = useState(false);

	const toggleCreating = () => setIsCreating((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		}
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values);
			toast.success("Course chapter created successfully");
			toggleCreating();
			router.refresh();
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course chapters
				<Button onClick={toggleCreating} variant="ghost">
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="w-4 h-4 mr-2" />
							Add a chapter
						</>
					)}
				</Button>
			</div>
			{isCreating && (
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
											placeholder="e.g.. Introductitojn to the course"
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
						<Button
							type="submit"
							disabled={!isValid || isSubmitting}
							variant="default"
						>
							Create
						</Button>
					</form>
				</Form>
			)}
			{!isCreating && (
				<>
					<div className={cn(
						"text-sm mt-2", 
						!initialData.chapters.length && "text-slate-500 italic"
					)}>
						{!initialData.chapters.length && "No chapters provided"}
						<ChaptersList 
							onEdit={() => {}}
							onReorder={() => {}}
							items={initialData.chapters || {}} />
					</div>
					<p className="text-xs mt-4 text-muted-foreground">
						Drag and drop to reorder the chapters
					</p>
				</>
			)}
		</div>
	);
};

