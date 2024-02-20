import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  
  const { userId } = auth();
  if(!userId) return redirect("/");

  const { completedCourses, courseInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {/* TODO: info card */}
        </div>
        <div>
          {/* TODO: info card */}
        </div>
      </div>
      <CoursesList items={[...completedCourses, ...courseInProgress]}  />
    </div>
  );
}

