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

		const { courseId, chapterId } = params;
		const values = await req.json();

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

			await db.muxData.create({
				data: {
					assetId: asset.id,
					chapterId: chapterId,
					playbackId: asset.playback_ids?.[0]?.id,
				},
			});
		}

		return new NextResponse(JSON.stringify(chapter), { status: 200 });
	} catch (error) {
		console.log(JSON.stringify(error));
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
