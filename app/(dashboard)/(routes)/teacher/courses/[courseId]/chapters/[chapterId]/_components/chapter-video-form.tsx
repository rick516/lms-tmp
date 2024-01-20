"use client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import MuxPlayer from "@mux/mux-player-react";
// import { cn } from "@/lib/utils";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterVideoFormProps {
	initialData: Chapter & { muxData?: MuxData | null };
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	videoUrl: z.string().min(1, { message: "a video url is required" }),
});

export const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { videoUrl: initialData?.videoUrl || "" },
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values,
			);
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
				Chapter Video
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData?.videoUrl && (
						<>
							<PlusCircle className="w-4 h-4 mr-2" />
							Add a video
						</>
					)}
					{!isEditing && initialData?.videoUrl && (
						<>
							<Pencil className="w-4 h-4 mr-2" />
							Edit a video
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.videoUrl ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<Video className="w-10 h-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload
						endpoint="chapterVideo"
						onChange={(url?: string) => {
							if (url) {
								onSubmit({ videoUrl: url });
							}
						}}
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Upload this chapter&apos;s video
					</div>
				</div>
			)}
			{initialData.videoUrl && !isEditing && (
				<div className="text-xs text-muted-foreground mt-4">
					Video can take a few minutes to process. Refresh the page to see the
					updated video.
				</div>
			)}
		</div>
	);
};
