"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Course, Attachment } from "@prisma/client";
import { File } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
}

const formSchema = z.object({
	url: z.string().min(1, { message: "attachment is required" }).nullable()
});

export const AttachmentForm = ({
	initialData, courseId
}: AttachmentFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { imageUrl: initialData?.imageUrl || "" }
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);
			toast.success("Course updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id);
			await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
			toast.success("Attachment deleted successfully");
			router.refresh();
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course Attachment
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && (
						<>Cancel</>
					)}
					{!isEditing && (
						<>
							<PlusCircle className="w-4 h-4 mr-2" />
							Add a file
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<>
					{initialData.attachments.length === 0 && (
						<p className="text-sm mt-2 text-slate-500 italic">
							No attachments added
						</p>
					)}
					{initialData.attachments.length > 0 && (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 rounded-md border-sky-200 border text-sky-700">
									<File className="w-4 h-4 mr-2 flex-shrink-0" />
									<p className="text-xs line-clamp-1">
										{attachment.name}
									</p>
									{deletingId === attachment.id ? (
										<div>
											<Loader2 className="w-4 h-4 animate-spin" />
										</div>
									) : (
										<button 
											className="ml-auto hover:opacity-75 transition"
											onClick={() => onDelete(attachment.id)}
										>
											<X className="w-4 h-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onChange={(url?: string) => {
							if (url) {
								onSubmit({ url: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add annything your studensts might need to complete the course.
					</div>
				</div>
			)}
		</div>
	);
}