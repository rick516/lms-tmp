import { formatPrice } from "@/lib/format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";

interface CourseCardProps {
	id: string;
	title: string;
	chapterLength: number;
	imageUrl: string | null;
	price: number;
	progress: number | null;
	category?: string | null;
}

export const CourseCard = ({
	id,
	title,
	chapterLength,
	imageUrl,
	price,
	progress,
	category,
}: CourseCardProps) => {
	return (
		<Link href={`/courses/${id}`}>
			<div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
				<div className="aspect-video relative w-full rounded-md overflow-hidden">
					<Image
						fill
						className="object-cover"
						src={imageUrl || "/images/placeholder.png"}
						alt={title}
					/>
				</div>
				<div className="flex flex-col pt-2">
					<div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
						{title}
					</div>
					<p className="text-xs text-muted-foreground"> {category}</p>
					<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
						<div className="flex items-center gap-x-1 text-slate-500">
							<IconBadge variant="default" size="sm" icon={BookOpen} />
							<span>
								{chapterLength} {chapterLength === 1 ? "Chapter" : "Chapters"}
							</span>
						</div>
					</div>
					{progress !== null ? (
						<div>TODO: Progress Component</div>
					) : (
						<p className="text-md md:text-sm font-medium text-slate-700">
							{formatPrice(price)}
						</p>
					)}
				</div>
			</div>
		</Link>
	);
};
