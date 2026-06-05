import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "./layouts/DefaultLayout"
import { HomePage } from "./pages/HomePage"
import { GamePage } from "./pages/GamePage"

export const App = () => {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  )
}
