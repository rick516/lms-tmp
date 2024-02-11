import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react"
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

	if (!chapter || !chapter.description || !course.price) return redirect("/");
	if (!muxData) return redirect("/");

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
						playbackId={muxData?.playbackId || ""}
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
								courseId={params.courseId}
							/>	
						)}
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div>
								{attachments.map((attachment) => (
									<div 
										key={attachment.id}
										className="border rounded-md bg-sky-200 text-sky-700 m-2 p-2 inline-flex items-center"
									>
										<a
											href={attachment.url}
											target="_blank"
											rel="noreferrer"
											className="flex items-center gap-x-2"
										>
											<File className="h-4 w-4"/>
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