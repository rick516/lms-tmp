import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Course } from "@prisma/client";
import Link from "next/link";

interface CourseListsProps {
	courses: Course[];
}

export const CourseLists = ({ courses }: CourseListsProps) => {
	return (
		<div>
			<header className="flex h-14 items-center border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
				<Link className="flex items-center gap-2 font-semibold" href="#">
					<Package2Icon className="h-6 w-6" />
					<span className="">Acme Inc</span>
				</Link>
				<div className="w-full flex-1">
					<form>
						<div className="relative">
							<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
							<Input
								className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
								placeholder="Search courses..."
								type="search"
							/>
						</div>
					</form>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
							size="icon"
							variant="ghost"
						>
							<img
								alt="Avatar"
								className="rounded-full"
								height="32"
								src="/placeholder.svg"
								style={{
									aspectRatio: "32/32",
									objectFit: "cover",
								}}
								width="32"
							/>
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>Support</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					<Card>
						<CardContent className="flex flex-col gap-2">
							<img
								alt="Course 1"
								className="object-cover w-full h-60"
								height={300}
								src="/placeholder.svg"
								style={{
									aspectRatio: "400/300",
									objectFit: "cover",
								}}
								width={400}
							/>
							<h3 className="font-semibold text-lg md:text-xl">Course 1</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Instructor Name
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
								</div>
							</div>
							<h4 className="font-semibold text-base md:text-lg">$99.99</h4>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="flex flex-col gap-2">
							<img
								alt="Course 2"
								className="object-cover w-full h-60"
								height={300}
								src="/placeholder.svg"
								style={{
									aspectRatio: "400/300",
									objectFit: "cover",
								}}
								width={400}
							/>
							<h3 className="font-semibold text-lg md:text-xl">Course 2</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Instructor Name
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
								</div>
							</div>
							<h4 className="font-semibold text-base md:text-lg">$99.99</h4>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="flex flex-col gap-2">
							<img
								alt="Course 3"
								className="object-cover w-full h-60"
								height={300}
								src="/placeholder.svg"
								style={{
									aspectRatio: "400/300",
									objectFit: "cover",
								}}
								width={400}
							/>
							<h3 className="font-semibold text-lg md:text-xl">Course 3</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Instructor Name
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
								</div>
							</div>
							<h4 className="font-semibold text-base md:text-lg">$99.99</h4>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="flex flex-col gap-2">
							<img
								alt="Course 4"
								className="object-cover w-full h-60"
								height={300}
								src="/placeholder.svg"
								style={{
									aspectRatio: "400/300",
									objectFit: "cover",
								}}
								width={400}
							/>
							<h3 className="font-semibold text-lg md:text-xl">Course 4</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Instructor Name
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-primary" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
									<StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
								</div>
							</div>
							<h4 className="font-semibold text-base md:text-lg">$99.99</h4>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
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
			<title>Package Icon</title>
			<path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
			<path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
			<path d="M12 3v6" />
		</svg>
	);
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<title>Search Icon</title>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}

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
