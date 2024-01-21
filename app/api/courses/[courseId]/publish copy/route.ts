import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } },
) {
	try {
		const { userId } = await auth();
		const { courseId } = params;

		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[COURSES]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
