import type { ReactNode } from "react";
import { Navbar } from "../../shared/components/Navbar";

interface DefaultLayoutProps {
  readonly children: ReactNode
}

export const DefaultLayout = ( { children }: DefaultLayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>    
  )
}