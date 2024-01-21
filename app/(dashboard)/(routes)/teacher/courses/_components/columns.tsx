"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown />
				</Button>
			);
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown />
				</Button>
			);
		},
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(price)

      return <div>{formattedPrice}</div>
    }
	},
	{
		accessorKey: "isPublished",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Publish
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const isPublished = row.getValue("isPublished") || false;
			return (
				<Badge
					className={cn(isPublished ? "bg-sky-700 text-white" : "bg-gray-600 text-white")}
					variant={isPublished ? "default" : "outline"}
				>
					{isPublished ? "Published" : "Draft"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { id } = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-4 w-8 p-0">
							<span className="sr-only">Open Menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<Link href={`/teacher/courses/${id}`}>
							<DropdownMenuItem key={`edit-${id}`}>
								<Pencil className="w-4 h-4 mr-2" />
								Edit
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
