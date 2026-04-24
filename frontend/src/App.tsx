// src/App.tsx
// Componente raíz: Solo se encarga de definir las rutas y el layout general.

import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import CategoriasPage from './pages/CategoriasPage'
import ProductsPage from './pages/ProductsPage'
import IngredientesPage from './pages/IngredientesPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Routes>
          {/* Redirigir la raíz a /categorias  */}
          <Route path="/" element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
