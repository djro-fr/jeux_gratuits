import { Outlet } from "react-router-dom"
import { Navbar } from "@/shared/components/Navbar"

export const DefaultLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}