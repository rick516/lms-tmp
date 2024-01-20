import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourseLists } from "./_components/course-lists";

const CoursesPage = () => {
	return (
		<div>
			<div className="p-6">
				<Link href="/teacher/create">
					<Button>New Courses</Button>
				</Link>
			</div>
			<div>
        <CourseLists />
      </div>
		</div>
	);
};

export default CoursesPage;
