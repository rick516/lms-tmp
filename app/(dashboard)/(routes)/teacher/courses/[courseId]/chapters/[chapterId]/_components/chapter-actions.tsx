"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
	isComplete: boolean;
}

export const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
	isComplete,
}: ChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const confetti = useConfettiStore();

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
			toast.success("Chapter deleted successfully");
			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch {
			toast.error("Something went wrong.");
		} finally {
			setIsLoading(false);
		}
	};

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (!isPublished && isComplete) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`,
					{ isComplete },
				);
				toast.success("Chapter published successfully");
				confetti.onOpen();
			}

			if (isPublished) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/unpublish`,
				);
				toast.success("Chapter unpublished successfully");
			}

			router.refresh();
			setIsLoading(false);
		} catch {
			toast.error("Something went wrong.");
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				variant="outline"
				size="sm"
				disabled={disabled || isLoading}
				onClick={onClick}
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={() => {}}>
				<Button size="sm" disabled={isLoading} onClick={onDelete}>
					<Trash className="w-4 h-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
