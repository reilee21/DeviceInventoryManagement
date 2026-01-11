import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { Navbar } from "@/components/Navbar"

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        return saved ? JSON.parse(saved) : false
    })

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
    }, [isCollapsed])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex min-h-screen bg-background">
                <Sidebar collapsed={isCollapsed} />

                {/* Main Content */}
                <div
                    className="flex-1 flex flex-col transition-all duration-300 ease-in-out bg-background"
                    style={{ marginLeft: isCollapsed ? "5rem" : "16rem" }}
                >
                    <Navbar
                        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
                        isSidebarCollapsed={isCollapsed}
                    />

                    <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
                        <div className="mx-auto max-w-7xl w-full">
                            <Outlet />
                        </div>
                    </main>

                    {/* Simple Footer */}
                    <footer className="px-8 py-6 border-t border-border text-muted-foreground text-xs flex justify-between items-center bg-card/30">
                        <p>© 2026 DYLAN TECH. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition-colors">Support</a>
                            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                        </div>
                    </footer>
                </div>
            </div>
        </ThemeProvider>
    )
}
