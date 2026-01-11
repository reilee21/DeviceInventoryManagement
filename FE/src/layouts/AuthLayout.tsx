import { Outlet } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"

export default function AuthLayout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Outlet />
            </div>
        </ThemeProvider>
    )
}
