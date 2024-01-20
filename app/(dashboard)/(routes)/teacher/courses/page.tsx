import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { CourseLists } from "./_components/course-lists";
import { Course } from ".prisma/client";

const CoursesPage = async () => {

  const courses = await db.course.findMany() as Array<Course>;

	return (
		<div>
			<div className="p-6">
				<Link href="/teacher/create">
					<Button>New Courses</Button>
				</Link>
			</div>
			<div>
        <CourseLists courses={courses} />
      </div>
		</div>
	);
};

export default CoursesPage;
