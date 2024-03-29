import { db } from "@/lib/db";
import { Attachment, Chapter, MuxData, Purchase, UserProgress } from "@prisma/client";

interface getChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
}

interface getChapterReturn {
	chapter: Chapter | null;
	course: { price: number } | null;
	muxData: MuxData | null;
	attachments: Attachment[];
	nextChapter: Chapter | null;
	userProgress: UserProgress | null;
	purchase: Purchase | null;
}

export const getChapter = async ({
	userId,
	courseId,
	chapterId,
}: getChapterProps) => {
	try {
		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId,
					courseId,
				},
			},
		});

		const course = await db.course.findUnique({
			where: {
				id: courseId,
				isPublished: true,
			},
			select: {
				price: true
				
			},
		}) as { price: number };

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				isPublished: true,
			},
		});

		if (!chapter || !course) throw new Error("Chapter or course not found");

		let muxData = null;
		let attachments: Attachment[] = [];
		let nextChapter: Chapter | null = null;

		if (purchase) {
			attachments = await db.attachment.findMany({
				where: {
					courseId,
				},
			});
		}

		if (chapter.isFree || purchase) {
			muxData = await db.muxData.findUnique({
				where: {
					chapterId: chapterId,
				},
			});

			console.log(`muxData: ${chapterId}`, muxData);

			nextChapter = await db.chapter.findFirst({
				where: {
					courseId: courseId,
					isPublished: true,
					position: {
						gt: chapter.position,
					},
				},
				orderBy: {
					position: "asc",
				},
			});

			console.log("nextChapter", nextChapter);
		}

		const userProgress = await db.userProgress.findUnique({
			where: {
				userId_chapterId: {
					userId: userId,
					chapterId: chapterId,
				},
			},
		});

		return {
			chapter,
			course,
			muxData,
			attachments,
			nextChapter,
			userProgress,
			purchase,
		} as getChapterReturn;
	} catch (error) {
		console.log("[GET_CHAPTER]", error);
		return {
      		chapter: null,
      		course: null,
      		muxData: null,
      		attachments: [],
      		nextChapter: null,
      		userProgress: null,
      		purchase: null,
		};
	}
};
