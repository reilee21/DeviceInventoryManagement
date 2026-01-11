import { createBrowserRouter, RouterProvider } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import DashboardLayout from "@/layouts/DashboardLayout"
import AuthLayout from "@/layouts/AuthLayout"
import Login from "@/pages/Login"
import { appRoutes } from "@/config/app-routes"
import type { RouteItem } from "@/config/app-routes"

const mapRouteToRouteObject = (route: RouteItem): RouteObject => ({
  path: route.path === "/" ? "" : route.path.replace(/^\//, ""),
  element: route.component ? <route.component /> : undefined,
  children: route.children?.map(mapRouteToRouteObject),
})

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: appRoutes.map(mapRouteToRouteObject),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
