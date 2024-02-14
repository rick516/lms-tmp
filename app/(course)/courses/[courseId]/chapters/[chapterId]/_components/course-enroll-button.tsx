"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CourseEnrollButtonProps {
	price: number;
	courseId: string;
}

export const CourseEnrollButton = ({
	price,
	courseId,
}: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
      console.log("courseId", courseId);
			const response = await axios.post(`/api/courses/${courseId}/checkout`);
			window.location.assign(response.data.url);
		} catch {
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button 
      onClick={onClick} 
      disabled={isLoading} 
      className="w-full md:w-auto"
    >
			Enroll for {formatPrice(price)}
		</Button>
	);
};
