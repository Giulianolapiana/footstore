// src/components/CategoriaList.tsx
import { Categoria } from '../types/categoria'
import CategoriaCard from './CategoriaCard'

interface CategoriaListProps {
  categorias: Categoria[]
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

// Ícono vacío SVG — sin emojis
const EmptyIcon = () => (
  <svg className="mx-auto mb-3 text-slate-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
  </svg>
)

const CategoriaList = ({ categorias, onEditar, onEliminar }: CategoriaListProps) => {
  if (categorias.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 animate-fade-in">
        <EmptyIcon />
        <p className="text-base font-medium text-slate-500">Sin categorías aún</p>
        <p className="text-sm mt-1">Hacé clic en "＋ Nueva Categoría" para empezar.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" role="table">
        <thead>
          <tr className="border-b-2 border-slate-100">
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 w-14">#</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Nombre</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Descripción</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {categorias.map((categoria, index) => (
            <CategoriaCard
              key={categoria.id}
              numero={index + 1}
              categoria={categoria}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoriaList
