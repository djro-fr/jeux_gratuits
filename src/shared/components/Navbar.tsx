
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const navigate = useNavigate()
  const {t} = useTranslation()

  return (    
    <nav id="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:opacity-80 transition">
            JeuxGratis
          </Link>
        </h1>
        <ul className="flex gap-8">
        <li>
          <button onClick={() => navigate('/game/yams')}>{t("game.yams")}</button>
        </li>
        <li>
          <button onClick={() => navigate('/about')}>{t("game.about")}</button>
        </li>
      </ul>
      </div>
   
    </nav>
  )
}