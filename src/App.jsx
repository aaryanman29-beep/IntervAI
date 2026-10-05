import { useState } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router"
import MobileNavbar from "./components/layout/MobileNavbar"
import Navbar from "./components/layout/Navbar"
import Sidebar from "./components/layout/Sidebar"

const lazyPage = (loadPage) => async () => {
  const page = await loadPage()
  return { Component: page.default }
}

function AppLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Navbar onMenu={() => setOpen(true)} />
      <Outlet />
      <MobileNavbar />
    </div>
  )
}

function HydrationFallback() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-canvas"
      role="status"
      aria-label="Loading page"
    >
      <span className="size-8 animate-spin rounded-full border-3 border-primary-soft border-t-primary" />
    </div>
  )
}

import { ProtectedRoute } from "./components/layout/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"

const router = createBrowserRouter([
  {
    path: "/",
    lazy: lazyPage(() => import("./pages/Landing")),
    HydrateFallback: HydrationFallback,
  },
  {
    path: "/login",
    lazy: lazyPage(() => import("./pages/Login")),
    HydrateFallback: HydrationFallback,
  },
  {
    path: "/register",
    lazy: lazyPage(() => import("./pages/Register")),
    HydrateFallback: HydrationFallback,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        HydrateFallback: HydrationFallback,
        children: [
          {
            path: "/dashboard",
            lazy: lazyPage(() => import("./pages/Dashboard")),
          },
          {
            path: "/interview/setup",
            lazy: lazyPage(() => import("./pages/InterviewSetup")),
          },
          {
            path: "/interview/mock",
            lazy: lazyPage(() => import("./pages/MockInterview")),
          },
          {
            path: "/interview/result/:id",
            lazy: lazyPage(() => import("./pages/InterviewResult")),
          },
          {
            path: "/questions",
            lazy: lazyPage(() => import("./pages/Questions")),
          },
          {
            path: "/questions/:id",
            lazy: lazyPage(() => import("./pages/QuestionDetails")),
          },
          {
            path: "/progress",
            lazy: lazyPage(() => import("./pages/Progress")),
          },
          {
            path: "/history",
            lazy: lazyPage(() => import("./pages/History")),
          },
          {
            path: "/bookmarks",
            lazy: lazyPage(() => import("./pages/Bookmarks")),
          },
          {
            path: "/profile",
            lazy: lazyPage(() => import("./pages/Profile")),
          },
          {
            path: "/settings",
            lazy: lazyPage(() => import("./pages/Settings")),
          },
          {
            path: "/roadmap",
            lazy: lazyPage(() => import("./pages/Roadmap")),
          },
        ],
      }
    ]
  },
  {
    path: "/404",
    lazy: lazyPage(() => import("./pages/NotFound")),
    HydrateFallback: HydrationFallback,
  },
  {
    path: "*",
    lazy: lazyPage(() => import("./pages/NotFound")),
    HydrateFallback: HydrationFallback,
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
