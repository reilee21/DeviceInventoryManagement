import { NavLink, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
    label: string
    path: string
    icon: LucideIcon
    level?: number
    collapsed?: boolean
}

export function SidebarItem({ label, path, icon: Icon, level = 0, collapsed }: SidebarItemProps) {
    const location = useLocation()
    const isActive = location.pathname === path

    return (
        <NavLink
            to={path}
            className={({ isActive: linkActive }) =>
                cn(
                    "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    level > 0 && !collapsed && "ml-4",
                    linkActive || isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                )
            }
            title={collapsed ? label : undefined}
        >
            <Icon className={cn(
                "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                (isActive) ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
            )} />
            {!collapsed && <span className="truncate">{label}</span>}
            {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
            )}
        </NavLink>
    )
}
