// src/components/CategoriaCard.tsx
import { Categoria } from '../types/categoria'

interface CategoriaCardProps {
  numero: number
  categoria: Categoria
  onEditar: (categoria: Categoria) => void
  onEliminar: (id: number) => void
}

const CategoriaCard = ({ numero, categoria, onEditar, onEliminar }: CategoriaCardProps) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-orange-50/40 transition-colors duration-150 group">
      <td className="px-5 py-3.5 text-slate-400 text-sm tabular-nums">{numero}</td>
      <td className="px-5 py-3.5 font-semibold text-slate-800">{categoria.nombre}</td>
      <td className="px-5 py-3.5 text-slate-500 text-sm">{categoria.descripcion || '—'}</td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEditar(categoria)}
            aria-label={`Editar ${categoria.nombre}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onEliminar(categoria.id)}
            aria-label={`Eliminar ${categoria.nombre}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CategoriaCard
