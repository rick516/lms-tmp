"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
	courseId: string;
	isPublished: boolean;
	disabled: boolean;
}
export const Actions = ({ courseId, isPublished, disabled }: ActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (!isPublished) {
				await axios.patch(`/api/courses/${courseId}/publish`);
			} else {
				await axios.patch(`/api/courses/${courseId}/unpublish`);
			}

			toast.success("Course published successfully");
			router.refresh();
		} catch {
			toast.error("An error occurred while publishing the course");
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}`);
			toast.success("Course deleted successfully");
			router.refresh();
		} catch {
			toast.error("An error occurred while deleting the course");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				variant="default"
				size="sm"
				onClick={onClick}
				disabled={disabled || isLoading}
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={() => {}}>
				<Button
					variant="outline"
					size="sm"
					onClick={onDelete}
					disabled={isLoading}
				>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
