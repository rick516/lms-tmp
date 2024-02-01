import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Course, Purchase } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
	chapters: { id: string }[];
	catetgory: Category | null;
	progress: number | null;
};

type GetCourses = {
	userId: string;
	title?: string;
	categoryId: string;
};

export const getCourses = async ({
	userId,
	title,
	categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
	try {
		const courses = await db.course.findMany({
			where: {
				isPublished: true,
				title: {
					contains: title,
				},
			},
			include: {
				category: true,
				chapters: {
					where: {
						isPublished: true,
					},
					select: {
						id: true,
					},
				},
				purchases: {
					where: {
						userId,
					},
				},
			},
		});

		const coursesWithProgress: CourseWithProgressWithCategory[] =
			await Promise.all(
				courses.map(async (course) => {
					if (course.purchases.length === 0) {
						return {
							...course,
							progress: null,
						};
					}
					const progressPercentage = await getProgress(userId, course.id);
				}),
			);

		return coursesWithProgress;
	} catch (error) {
		console.log("[GET_COURSES]", error);
		return [];
	}
};