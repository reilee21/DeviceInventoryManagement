import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    isLoading?: boolean
    className?: string
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    className,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null

    return (
        <div className={cn("flex items-center justify-between px-2 py-4", className)}>
            <div className="flex-1 text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-border bg-card hover:bg-muted"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-border bg-card hover:bg-muted"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 px-2">
                    {/* Simple page numbers could go here if needed, but for now we use arrows and status */}
                    <span className="text-sm font-medium">
                        {currentPage}
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-border bg-card hover:bg-muted"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-border bg-card hover:bg-muted"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
