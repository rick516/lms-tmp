import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { CourseLists } from "./_components/course-lists";
import { DataTable } from "./_components/data-table";

const CoursesPage = async () => {

	const { userId } = await auth();
	if(!userId) return redirect("/");

  const courses = await db.course.findMany({
		where: {
			userId
		},
		orderBy: {
			createdAt: "desc"
		},
	});

	return (
		<div>
			<div className="mt-16 p-6">
				<DataTable columns={columns} data={courses} />
			</div>
			<div>
        <CourseLists courses={courses} />
      </div>
		</div>
	);
};

export default CoursesPage;
