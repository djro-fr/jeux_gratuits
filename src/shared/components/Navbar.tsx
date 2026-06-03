
import { Link, useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:opacity-80 transition">
            Mini Games
          </Link>
        </h1>
        <ul className="flex gap-8">
        <li>
          <button onClick={() => navigate('/game/yams')}>Yams</button>
        </li>
      </ul>
      </div>
   
    </nav>
  )
}