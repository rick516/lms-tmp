"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
	chapterId: string;
	courseId: string;
	nextChapterId?: string;
	isCompleted?: boolean;
}

export const CourseProgressButton = ({
	chapterId,
	courseId,
	nextChapterId,
	isCompleted: initialIsCompleted,
}: CourseProgressButtonProps) => {
	const Icon = initialIsCompleted ? XCircle : CheckCircle;

	const router = useRouter();
	const confetti = useConfettiStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isCompleted, setIsCompleted] = useState(initialIsCompleted);

	useEffect(() => {
		setIsCompleted(initialIsCompleted);
	}, [initialIsCompleted]);

	const onClick = async () => {
		try {
			setIsLoading(true);
			const response = await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
				isCompleted: !isCompleted,
			});
			await setIsCompleted(response.data.isCompleted);

			if (isCompleted && !nextChapterId) {
				confetti.onOpen();
			}

			if (isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
			}

			toast.success("Chapter marked as completed");
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant={!isCompleted ? "secondary" : "outline"}
			size="sm"
			disabled={isLoading}
			onClick={onClick}
		>
			{!isCompleted ? "Mark as completed" : "Completed"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
