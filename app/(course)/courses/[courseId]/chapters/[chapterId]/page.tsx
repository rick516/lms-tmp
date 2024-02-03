import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CourseEnrollButton } from "./_components/course-enroll-button";
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

	if (!chapter || !course) return redirect("/");

	const isLocked = !chapter.isFree && !purchase;
	const isCompletedOnEnd = !!purchase && !userProgress?.isCompleted;

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
						chapterId={chapter.id}
						playbackId={muxData?.playbackId}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						title={chapter.title}
						isLocked={isLocked}
						isCompletedOnEnd={isCompletedOnEnd}
					/>
				</div>
				<div>
					<div className="flex items-center justify-between md:flex-row flex-col p-4">
						<h2 className="text-2xl font-semibold mb-2">
							{chapter.title}
						</h2>
						{purchase ? (
							<div>course progress</div>
						) : (
							<CourseEnrollButton
								price={course.price}
								courseId={course.id}
							/>	
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
