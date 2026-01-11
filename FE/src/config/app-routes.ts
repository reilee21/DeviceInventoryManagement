import {
    LayoutDashboard,
    Package,
    Boxes,
    ShoppingCart,
    Users,
    TrendingUp,
    ClipboardList
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import React from "react"
import Dashboard from "@/pages/Dashboard"
import Products from "@/pages/Products"
import Inventory from "@/pages/Inventory"
import Purchases from "@/pages/Purchases"
import PurchaseDetail from "@/pages/PurchaseDetail"
import Customers from "@/pages/Customers"
import Sales from "@/pages/Sales"
import SaleDetail from "@/pages/SaleDetail"
import FinanceDashboard from "@/pages/FinanceDashboard"
import Audit from "@/pages/Audit"

export interface RouteItem {
    label: string
    path: string
    icon: LucideIcon
    sidebar: boolean
    group?: string
    children?: RouteItem[]
    component?: React.ComponentType
}

export const appRoutes: RouteItem[] = [
    {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        sidebar: true,
        group: "OVERVIEW",
        component: Dashboard,
    },
    {
        label: "Products",
        path: "/products",
        icon: Package,
        sidebar: true,
        group: "CATALOG",
        component: Products,
    },
    {
        label: "Inventory",
        path: "/inventory",
        icon: Boxes,
        sidebar: true,
        group: "CATALOG",
        component: Inventory,
    },
    {
        label: "Purchases",
        path: "/purchases",
        icon: ShoppingCart,
        sidebar: true,
        group: "RETAIL",
        component: Purchases,
    },
    {
        label: "Purchase Detail",
        path: "/purchases/:id",
        icon: ShoppingCart,
        sidebar: false,
        component: PurchaseDetail,
    },
    {
        label: "Customers",
        path: "/customers",
        icon: Users,
        sidebar: true,
        group: "RETAIL",
        component: Customers,
    },
    {
        label: "Sales",
        path: "/sales",
        icon: TrendingUp,
        sidebar: true,
        group: "RETAIL",
        component: Sales,
    },
    {
        label: "Sale Detail",
        path: "/sales/:id",
        icon: TrendingUp,
        sidebar: false,
        component: SaleDetail,
    },
    {
        label: "Finance",
        path: "/finance",
        icon: TrendingUp,
        sidebar: true,
        group: "ANALYTICS",
        component: FinanceDashboard,
    },
    {
        label: "Audit",
        path: "/audit",
        icon: ClipboardList,
        sidebar: true,
        group: "ANALYTICS",
        component: Audit,
    },
]
