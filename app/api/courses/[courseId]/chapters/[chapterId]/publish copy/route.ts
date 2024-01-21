import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
	throw new Error(
		"MUX_TOKEN_ID or MUX_TOKEN_SECRET is not defined in the environment variables.",
	);
}
const { Video } = new Mux(MUX_TOKEN_ID, MUX_TOKEN_SECRET);

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });
		const { isComplete } = await req.json();

		const { courseId, chapterId } = params;

		if (!isComplete) return new NextResponse("Chapter is not ready to publish", { status: 30 });

		const publishedChapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: { isPublished: true } ,
		});

		return new NextResponse(JSON.stringify(publishedChapter), { status: 200 });
	} catch (error) {
		console.log(JSON.stringify(error));
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
