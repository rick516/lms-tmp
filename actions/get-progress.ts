import { db } from "@/lib/db";

export const getProgress = async (
  userid: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      },
      select: {
        id: true
      }
    });

    const publishedChapterIds = await publishedChapters.map((chapter) => chapter.id);

    const validComplitedChapterCount: number = await db.userProgress.count({
      where: {
        userId: userid,
        chapterId: {
          in: publishedChapterIds
        },
        isCompleted: true
      }
    })

    const progressPercentage = (validComplitedChapterCount / publishedChapters.length) * 100;
    return progressPercentage;

  } catch (error) {
    console.log("[GET_PROGRESS]", error)
    return 0;
  }
};