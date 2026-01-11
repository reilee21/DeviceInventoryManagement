import { appRoutes, type RouteItem } from "@/config/app-routes"
import { SidebarItem } from "./SidebarItem"
import { cn } from "@/lib/utils"

interface SidebarProps {
    collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
    const groupedRoutes = appRoutes.filter(route => route.sidebar).reduce((acc: Record<string, RouteItem[]>, route) => {
        const group = route.group || "MAIN"
        if (!acc[group]) acc[group] = []
        acc[group].push(route)
        return acc
    }, {})

    return (
        <aside
            className={cn(
                "border-r border-sidebar-border flex flex-col fixed inset-y-0 transition-all duration-300 ease-in-out bg-sidebar z-50 text-sidebar-foreground shadow-sm",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className={cn(
                "h-16 flex items-center px-6 border-b border-sidebar-border transition-all duration-300",
                collapsed ? "justify-center px-0" : "justify-between"
            )}>
                {!collapsed ? (
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-sidebar-primary to-sidebar-primary/60 bg-clip-text text-transparent">
                        DYLAN ADMIN
                    </span>
                ) : (
                    <span className="font-bold text-xl text-sidebar-primary">D</span>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
                {Object.entries(groupedRoutes).map(([group, routes]) => (
                    <div key={group} className="space-y-1">
                        {!collapsed && (
                            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                                {group}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <div key={route.path}>
                                    <SidebarItem
                                        label={route.label}
                                        path={route.path}
                                        icon={route.icon}
                                        collapsed={collapsed}
                                    />
                                    {route.children && !collapsed && (
                                        <div className="mt-1 space-y-1">
                                            {route.children.filter(child => child.sidebar).map((child) => (
                                                <SidebarItem
                                                    key={child.path}
                                                    label={child.label}
                                                    path={child.path}
                                                    icon={child.icon}
                                                    level={1}
                                                    collapsed={collapsed}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-b border-sidebar-border last:border-0" />
                    </div>
                ))}
            </nav>

            <div className={cn(
                "p-4 border-t border-sidebar-border transition-all",
                collapsed ? "px-2" : "px-4"
            )}>
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all",
                    collapsed && "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold overflow-hidden shadow-sm">
                        JD
                    </div>
                    {!collapsed && (
                        <div className="flex-1 truncate">
                            <p className="text-sm font-medium truncate">John Doe</p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
