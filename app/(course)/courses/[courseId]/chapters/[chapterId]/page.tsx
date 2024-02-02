import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


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
		</div>
	);
};

export default ChapterIdPage;
