import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CourseMobileSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress;
		})[];
	};
	progressCount: number;
}

export const CourseMobileSidebar = ({
	course,
	progressCount,
}: CourseMobileSidebarProps) => {
	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu />
			</SheetTrigger>
			<SheetContent side="left"	className="p-0 w-72 bg-white">
				<CourseSidebar course={course} progressCount={progressCount} />
			</SheetContent>
		</Sheet>
	);
};
