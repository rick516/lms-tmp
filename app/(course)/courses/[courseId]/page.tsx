import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
	params,
}: {
	params: {
		courseId: string;
	};
}) => {
	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			isPublished: true,
		},
		include: {
			chapters: {
				where: {
          isPublished: true
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	if (!course) return redirect("/");

	return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
