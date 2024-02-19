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

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const { courseId, chapterId } = params;

		const ownCourse = await db.course.findUnique({
			where: {
				id: courseId,
				userId: userId,
			},
		});

		if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				courseId: courseId,
			},
		});

		if (!chapter) return new NextResponse("Chapter not found", { status: 404 });

		if (chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
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

		const deletedChapter = await db.chapter.delete({
			where: {
				id: chapterId,
				courseId: courseId,
			},
		});

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: courseId,
				isPublished: true,
			},
		});

		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return new NextResponse(JSON.stringify(deletedChapter), {
			status: 200,
		});
	} catch (error) {
		console.log("[CHAPTER_DELETE]", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = await auth();
		if (!userId) return new NextResponse("Unauthorized", { status: 401 });

		const { courseId, chapterId } = params;
		const values = await req.json();

		console.log("values");
		console.log(values);

		const chapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId: courseId,
			},
			data: values,
		});

		if (values.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: chapterId,
				},
			});

			console.log("existMuxDataData");
			console.log(existingMuxData);

			if (existingMuxData) {
				await Video.Assets.del(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}

			const asset = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: "public",
				test: false,
			});

			console.log("asset");
			console.log(asset);

			await db.muxData.create({
				data: {
					assetId: asset.id,
					chapterId: chapterId,
					playbackId: asset.playback_ids?.[0]?.id as string,
				},
			});
		}

		return new NextResponse(JSON.stringify(chapter), { status: 200 });
	} catch (error) {
		console.log(JSON.stringify(error));
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}