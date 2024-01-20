"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
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
}

export const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
			toast.success("Chapter deleted successfully");
			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch {
			toast.error("Something went wrong.");
		}
	};

	const onClick = async () => {
		try {
			setIsLoading(true);

			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
				isPublished: !isPublished,
			});

			toast.success(
				`Chapter publish status changed to: ${
					isPublished === true ? "Published" : "Unpublished"
				}`,
			);
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
