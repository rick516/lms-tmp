import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
	ArrowLeft,
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListChecks,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import { AttachmentForm } from "./_components/attachment-form";
import { CategoryForm } from "./_components/category-form";
import { ChaptersForm } from "./_components/chapters-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { TitleForm } from "./_components/title-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	if (!userId) return redirect("/");

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			userId: userId,
		},
		include: {
			attachments: {
				orderBy: {
					createdAt: "desc",
				},
			},
			chapters: {
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	if (!course) return redirect("/teacher/courses");

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;

	const isCompleted = completedFields === totalFields;

	return (
		<>
			{!course.isPublished && (
				<Banner variant="warning" label="This course is not published" />
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Link
							href="/teacher/courses"
							className="flex item-center text-sm hover:opacity-75 transition"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to course setup
						</Link>
					</div>
				</div>
				<div className="flex items-center justify-between mt-4">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">Course Setup</h1>
						<span className="text-sm text-slate-700">
							Complete all fields {completionText}
						</span>
					</div>
					<Actions
						disabled={!isCompleted}
						courseId={course.id}
						isPublished={course.isPublished}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} variant="default" size="sm" />
							<h2 className="text-xl">Customize your course</h2>
						</div>
						<TitleForm initialData={course} courseId={course.id} />
						<DescriptionForm initialData={course} courseId={course.id} />
						<ImageForm initialData={course} courseId={course.id} />
						<CategoryForm
							initialData={course}
							courseId={course.id}
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
						/>
					</div>
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListChecks} variant="default" size="sm" />
								<h2 className="text-xl">Course Chapters</h2>
							</div>
							<ChaptersForm initialData={course} courseId={course.id} />
							<div className="flex items-cneter gap-x-2 mt-6">
								<IconBadge
									icon={CircleDollarSign}
									variant="default"
									size="sm"
								/>
								<h2 className="text-xl">Sell your course</h2>
							</div>
							<PriceForm initialData={course} courseId={course.id} />
						</div>
						<div>
							<div className="flex items-cneter gap-x-2">
								<IconBadge icon={File} variant="default" size="sm" />
								<h2 className="text-xl">Resources & Attachments</h2>
							</div>
							<AttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseIdPage;
