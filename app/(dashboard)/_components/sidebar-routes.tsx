"use client";

import { Layout, Compass } from "lucide-react"
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/"
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search"
  },
]

export const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {guestRoutes.map((route) => {
        return (
          <SidebarItem
            key={route.href}
            label={route.label}
            icon={route.icon}
            href={route.href}
          />
        )
      })}
    </div>
  );
}

export default SidebarRoutes;