"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	imageUrl: z.string().min(1, { message: "imageUrl is required" }).nullable()
});

export const ImageForm = ({
	initialData, courseId
}: ImageFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);


	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { imageUrl: initialData?.imageUrl || "" }
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
				Course Image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && (
						<>Cancel</>
					)}
					{!isEditing && !initialData?.imageUrl && (
						<>
							<PlusCircle className="w-4 h-4 mr-2" />
							Add an image
						</>
					)}
					{!isEditing && initialData?.imageUrl && (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit image
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				!initialData.imageUrl ? (
					<p className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="w-10 h-10 text-slate-500" />
					</p>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							src={initialData.imageUrl}
							alt="Upload Image"
							fill
							className="object-cover rounded-md"
						/>
					</div>
				)
			)}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseImage"
						onChange={(url?: string) => {
							if (url) {
								onSubmit({ imageUrl: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16.9 aspect reccomended
					</div>
				</div>
			)}
		</div>
	);
}