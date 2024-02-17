"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

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
	isCompleted,
}: CourseProgressButtonProps) => {

	const Icon = isCompleted ? XCircle : CheckCircle;

	return (
		<Button
			variant="default"
			size="default"
			disabled={isCompleted}
			onClick={() => {}}
		>
			{isCompleted ? "UnCompleted" : "Mark as completed"}
			<Icon />
		</Button>
	);
};
