import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const { courseId, chapterId } = params;
		
		const ownCourse = await db.course.findFirst({
			where: {
				id: courseId,
				userId: userId,
			},
		});

		if (!ownCourse) return new NextResponse("Course not found", { status: 404 });
		
		const chapter = await db.chapter.findFirst({
			where: {
				id: chapterId,
				courseId: courseId,
			},
		});
		
		if (!chapter) return new NextResponse("Chapter not found", { status: 404 });

		const unpublishedChapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: { isPublished: false } ,
		});

		return new NextResponse(JSON.stringify(unpublishedChapter), { status: 200 });
	} catch (error) {
		console.log(JSON.stringify(error));
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
