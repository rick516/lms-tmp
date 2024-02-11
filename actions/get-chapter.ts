import { db } from "@/lib/db";
import { Attachment, Chapter, MuxData } from "@prisma/client";

interface getChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
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
				price: true,
			},
		});

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				isPublished: true,
			},
		});

		console.log("chapter id");
		console.log(chapterId);

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
			muxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});

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
			course,
			chapter,
			nextChapter,
			attachments,
			purchase,
			userProgress,
			muxData,
		};
	} catch (error) {
		console.log("[GET_CHAPTER]", error);
		return {
			course: null,
			chapter: null,
			nextChapter: null,
			attachments: [],
			purchase: null,
			muxData: null,
		};
	}
};
