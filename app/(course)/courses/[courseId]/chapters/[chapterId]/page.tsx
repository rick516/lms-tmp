import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
// import { CourseProgress } from "@/components/course-progress";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react";
import { redirect } from "next/navigation";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
	params,
}: {
	params: {
		courseId: string;
		chapterId: string;
	};
}) => {
	const { userId } = auth();
	if (!userId) return redirect("/");

	const {
		course,
		chapter,
		nextChapter,
		attachments,
		userProgress,
		purchase,
		muxData,
	} = await getChapter({
		userId,
		courseId: params.courseId,
		chapterId: params.chapterId,
	});

	if (!course || !chapter || !muxData || !muxData.playbackId) {
		return redirect("/");
	}

	const isLocked = !chapter.isFree && !purchase;
	const isCompletedOnEnd =
		!!purchase && (!!userProgress?.isCompleted as boolean);

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner
					variant="success"
					label="You have already completed this chapter."
				/>
			)}
			{isLocked && (
				<Banner
					variant="warning"
					label="you must purchase this course to access this chapter."
				/>
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						key={params.chapterId}
						chapterId={params.chapterId}
						playbackId={muxData.playbackId}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						title={chapter.title}
						isLocked={isLocked}
						isCompletedOnEnd={isCompletedOnEnd}
					/>
				</div>
				<div>
					<div className="flex items-center justify-between md:flex-row flex-col p-4">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						{purchase ? (
							<CourseProgressButton
								chapterId={params.chapterId}
								courseId={params.courseId}
								nextChapterId={nextChapter?.id}
								isCompleted={isCompletedOnEnd}
							/>
						) : (
							<CourseEnrollButton
								price={course.price || 0}
								courseId={params.courseId}
							/>
						)}
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description || ""} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div>
								{attachments.map((attachment) => (
									<div
										key={attachment.id}
										className="rounded-md bg-sky-100 border-sky-200 border text-sky-700 m-1 p-1 inline-flex items-center"
									>
										<a
											href={attachment.url}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-x-2"
										>
											<File className="h-4 w-4" />
											<p>{attachment.name}</p>
										</a>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
