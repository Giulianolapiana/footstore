// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom'

// SVG logo inline — sin emojis (skill rule: no-emoji-icons)
const FoodStoreLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="#f97316" />
    <path
      d="M8 11c0-1.1.9-2 2-2h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4 3 3 0 0 1-3-3v-3Z"
      fill="white" opacity=".9"
    />
    <path
      d="M17 10h2a5 5 0 0 1 5 5v1a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-6Z"
      fill="white" opacity=".75"
    />
    <rect x="9" y="20" width="14" height="2.5" rx="1.25" fill="white" opacity=".9" />
  </svg>
)

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'relative text-sm font-medium transition-colors duration-150 px-1 py-0.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded',
    isActive
      ? 'text-orange-400'
      : 'text-slate-300 hover:text-white',
  ].join(' ')

const Navbar = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* Marca */}
        <NavLink
          to="/categorias"
          className="flex items-center gap-2.5 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
          aria-label="Food Store — Ir al inicio"
        >
          <FoodStoreLogo />
          <span className="text-base font-bold tracking-tight text-white group-hover:text-orange-300 transition-colors duration-150">
            Food Store
          </span>
        </NavLink>

        {/* Navegación principal */}
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-1">
            {[
              { to: '/categorias',  label: 'Categorías'  },
              { to: '/productos',   label: 'Productos'   },
              { to: '/ingredientes',label: 'Ingredientes'},
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass} end>
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span
                          className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
