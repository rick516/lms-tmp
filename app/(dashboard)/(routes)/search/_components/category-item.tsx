"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { IconType as Icon } from "react-icons";

interface CategoryItemProps {
	itemKey: string;
	label: string;
	icon?: Icon;
	value?: string;
}

export const CategoryItem = ({
	itemKey,
	label,
	icon,
	value,
}: CategoryItemProps) => {
	const Icon = icon;
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get("categoryId");
	const currentTitle = searchParams.get("title");
	const isSelected = currentCategoryId === value;

	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					categoryId: isSelected ? undefined : value,
					title: currentTitle,
				},
			},
			{
				skipNull: true,
				skipEmptyString: true,
			},
		);

		router.push(url);
	};
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center px-3 py-2 border text-sm rounded-full gap-x-1 transition hover:border-sky-700",
				isSelected && "border-sky-700 bg-sky-200/20 text-sky-800",
			)}
			type="button"
		>
			{Icon && <Icon size={20} />}
			<div className="truncate">{label}</div>
		</button>
	);
};
