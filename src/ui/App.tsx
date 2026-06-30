import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "./layouts/DefaultLayout"
import { YamsLayout } from "./layouts/YamsLayout"
import { HomePage } from "./pages/HomePage"
import { GamePage } from "./pages/GamePage"
import { YamsPage } from "@/features/games/yams/ui/pages/YamsPage"
import { AboutPage } from "./pages/AboutPage"

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />

        </Route>
        <Route element={<YamsLayout />}>
          <Route path="/game/yams" element={<YamsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}