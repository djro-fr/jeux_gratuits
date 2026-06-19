import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "./layouts/DefaultLayout"
import { HomePage } from "./pages/HomePage"
import { GamePage } from "./pages/GamePage"
import { YamsPage } from "@/features/games/yams/ui/pages/YamsPage"

export const App = () => {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/yams" element={<YamsPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
    
  )
}
