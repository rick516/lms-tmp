"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useRouter } from "next/navigation";
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
	const router = useRouter();

	const onEnroll = async () => {
		try {
			setIsLoading(true);
      console.log("courseId", courseId);
			const response = await axios.post(`/api/courses/${courseId}/checkout`);
			setIsLoading(false);
			router.push(response.data.id);
		} catch (error) {
			toast.error( `An error occurred. Please try again: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button 
      onClick={onEnroll} 
      disabled={isLoading} 
      className="w-full md:w-auto"
    >
			Enroll for {formatPrice(price)}
		</Button>
	);
};
