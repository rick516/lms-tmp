"use client";

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {
	FcEngineering,
	FcFilmReel,
	FcMultipleDevices,
	FcMusic,
  FcNook,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode

} from "react-icons/fc";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
	items: Category[];
}


const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Engineering: FcEngineering,
  Film: FcFilmReel,
  Photography: FcOldTimeCamera,
  Accounting: FcSalesPerformance,
  Sports: FcSportsMode,
  Math: FcNook,
  "Computer Science": FcMultipleDevices,
}

export const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className="flex items-center gap-x-2 overflow-x-auto pb-2">
			{items.map((category) => (
				<div>
					<CategoryItem
            key={category.id}
            label={category.name}
            icon={iconMap[category.name]}
            value={category.id}
          />
				</div>
			))}
		</div>
	);
};
