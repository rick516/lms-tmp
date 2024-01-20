import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { MuxData } from '@prisma/client';
import { NextResponse } from "next/server";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
	throw new Error(
		"MUX_TOKEN_ID or MUX_TOKEN_SECRET is not defined in the environment variables.",
	);
}
const { Video } = new Mux(MUX_TOKEN_ID, MUX_TOKEN_SECRET);

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string } },
) {
	try {
		const { userId } = await auth();
		const { courseId } = params;

		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const chaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: courseId,
			},
      include: {
        muxData: true,
      },
		});

		for (const chapter of chaptersInCourse) {
			if (chapter.videoUrl) {
				const existingMuxData = await db.muxData.findFirst({
					where: {
						chapterId: chapter.id,
					},
				});

				if (existingMuxData) {
					await Video.Assets.del(existingMuxData.assetId);
					await db.muxData.delete({
						where: {
							id: existingMuxData.id,
						},
					});
				}
			}
			await db.chapter.delete({
				where: {
					id: chapter.id,
				},
			});
		}
		await db.course.delete({
			where: {
				id: courseId,
			},
		});

		return new NextResponse("Course deleted successfully", { status: 200 });

	} catch (error) {
		console.log("[COURSES]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } },
) {
	try {
		const { userId } = await auth();
		const { courseId } = params;
    const values = await req.json()

		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
      data: {
        ...values
      }
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[COURSES]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}