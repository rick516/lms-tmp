import { Preview } from "@/components/preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Link from "next/link";

interface CourseListsProps {
	courses: Course[];
}

export const CourseLists = ({ courses = [] }: CourseListsProps) => {
	return (
		<div>
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{courses.map((course) => (
						<Link href={`/teacher/courses/${course.id}`}>
							<Card key={course.id}>
								<CardContent className="flex flex-col gap-2">
									<img
										alt={course.title}
										className="object-cover w-full h-60"
										height={300}
										src={course.imageUrl || "/placeholder.svg"}
										style={{
											aspectRatio: "400/300",
											objectFit: "cover",
										}}
										width={400}
									/>
									<h3 className="font-semibold text-lg md:text-xl">
										{course.title}
									</h3>
									{course.description && (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											<Preview value={course.description}/>
										</p>
									)}
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-0.5">
											<StarIcon className="w-5 h-5 fill-primary" />
											<StarIcon className="w-5 h-5 fill-primary" />
											<StarIcon className="w-5 h-5 fill-primary" />
											<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
											<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
										</div>
									</div>
									<div className="flex items-center- justify-between">
										<h4 className="font-semibold text-base md:text-lg">
											${course.price}
										</h4>
										<Badge
											className={cn(
												"bg-slate-500",
												course.isPublished && "text-white bg-sky-700",
											)}
										>
											{course.isPublished ? "Published" : "Draft"}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</main>
		</div>
	);
};

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Star Icon</title>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	);
}
