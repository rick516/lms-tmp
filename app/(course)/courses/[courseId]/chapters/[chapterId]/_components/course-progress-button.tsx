"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

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

	const [isLoading, setIsLoading] = useState(false);

	const handleProgress = async () => {
		try {
			setIsLoading(true);
			// const response = await axios.post(`api/courses/${courseId}/chapters/${chapterId}/progress`);
			toast.success("Chapter marked as completed");
		} catch {
			setIsLoading(true);
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={!isCompleted ? "secondary" : "outline"}
			size="sm"
			disabled={isCompleted || isLoading}
			onClick={handleProgress}
		>
			{!isCompleted ? "Mark as completed" : "Completed"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
