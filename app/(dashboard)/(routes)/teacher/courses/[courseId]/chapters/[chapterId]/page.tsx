import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterActions } from "./_components/chapter-actions";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";

const ChapterIdPage = async ({
	params,
}: { params: { courseId: string; chapterId: string } }) => {
	const { userId } = auth();

	if (!userId) return redirect("/");

	const chapter = await db.chapter.findUnique({
		where: {
			id: params.chapterId,
			courseId: params.courseId,
		},
		include: {
			muxData: true,
		},
	});

	if (!chapter) return redirect(`/teacher/courses/${params.courseId}`);

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completationText = `(${completedFields}/${totalFields})`;

	const isComplete = requiredFields.every(Boolean);

	return (
		<>
			{!chapter.isPublished && (
				<Banner variant="warning" label="This chapter is not published" />
			)}
			<div>
				<div className="p-6">
					<div className="flex items-center justify-between">
						<div className="w-full">
							<Link
								href={`/teacher/courses/${params.courseId}`}
								className="flex item-center text-sm hover:opacity-75 transition"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to course setup
							</Link>
						</div>
					</div>
					<div className="flex items-center justify-between mt-6">
						<div className="flex flex-col gap-y-2">
							<h2 className="text-2xl font-medium">Chapter Setup</h2>
							<span className="text-sm">
								Complete all fields {completationText}
							</span>
						</div>
						<ChapterActions
							disabled={!isComplete}
							courseId={params.courseId}
							chapterId={params.chapterId}
							isPublished={chapter.isPublished}
							isComplete={isComplete}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={LayoutDashboard} variant="default" size="sm" />
								<h2 className="text-2xl">Customize your chapter</h2>
							</div>
							<ChapterTitleForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
							<ChapterDescriptionForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
							<div className="flex items-center gap-x-2 mt-6">
								<IconBadge icon={Eye} variant="default" size="sm" />
								<h2 className="text-2xl">Access Settings</h2>
							</div>
							<ChapterAccessForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
						</div>
						<div className="space-y-6">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={Video} variant="default" size="sm" />
									<h2 className="text-2xl">Add a video</h2>
								</div>
								<ChapterVideoForm
									initialData={chapter}
									courseId={params.courseId}
									chapterId={params.chapterId}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChapterIdPage;
