import type { ReactNode } from "react";
import { Navbar } from "../../shared/components/Navbar";

interface DefaultLayoutProps {
  readonly children: ReactNode
}

export const DefaultLayout = ( { children }: DefaultLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main>
        {children}
      </main>
    </div>    
  )
}