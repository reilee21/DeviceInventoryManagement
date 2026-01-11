import { Menu, Search, Bell, Moon, Sun, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavbarProps {
    onToggleSidebar: () => void
    isSidebarCollapsed: boolean
}

export function Navbar({ onToggleSidebar, isSidebarCollapsed }: NavbarProps) {
    return (
        <header className={cn(
            "h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/95 backdrop-blur z-40 transition-all duration-300 shadow-sm",
            isSidebarCollapsed ? "backdrop-blur-none" : ""
        )}>
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg"
                >
                    <Menu className={cn("h-5 w-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
                </Button>

                <div className="relative max-w-md w-full hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search dashboard..."
                        className="pl-10 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-10 rounded-xl transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg"
                    onClick={() => {
                        const root = window.document.documentElement
                        root.classList.toggle("dark")
                    }}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex gap-3 px-2 hover:bg-muted rounded-lg transition-all h-10">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shadow-inner">
                                JD
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-semibold leading-none text-foreground">John Doe</p>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-wider">Admin</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                        <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                            <User className="h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                            <Settings className="h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer text-destructive focus:text-destructive">
                            <LogOut className="h-4 w-4" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
