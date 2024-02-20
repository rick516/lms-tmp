import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
}

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  courseInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];
    for (const course of courses) {
      const progress = await getProgress(course.id, userId);
      course.progress = progress;
    }

    const completedCourses = await courses.filter((course) => course.progress === 100);
    const courseInProgress = await courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      courseInProgress,
    }
  } catch (error) {
    console.log("GET_DASHBOARD_COURSES", error);
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }
};

