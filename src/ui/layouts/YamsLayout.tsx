import { Outlet } from "react-router-dom"
import { NavbarYams } from "@/shared/components/NavbarYams"

export const YamsLayout = () => {
  return (
    <div className="h-full flex flex-col">
      <NavbarYams />
      <main>
        <Outlet />
      </main>
    </div>
  )
}