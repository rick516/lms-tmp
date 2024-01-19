import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { ArrowLeft } from "lucide-react";
import { ChapterTitleForm } from "./_components/chapter-title-form"
import { ChapterDescriptionForm } from "./_components/chapter-description-form" 
import { IconBadge } from "@/components/icon-badge"
import { LayoutDashboard, ListChecks, CircleDollarSign, File } from "lucide-react";


const ChapterIdPage = async ({
  params
}: { params: { courseId: string, chapterId: string } }) => {

  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true,
    }
  })

  if (!chapter) return redirect("/");

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completationText = `(${completedFields}/${totalFields})`


  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex item-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-medium">Chapter Setup</h2>
        <p className="text-sm">Complete all fields {completationText}</p>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-x-2 mt-6">
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
      </div>
    </div>
  );
}

export default ChapterIdPage;