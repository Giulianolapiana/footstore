// src/components/IngredienteList.tsx
import { Ingrediente } from '../types/ingrediente'

interface IngredienteListProps {
  ingredientes: Ingrediente[]
  onEditar: (ingrediente: Ingrediente) => void
  onEliminar: (id: number) => void
}

const EmptyIcon = () => (
  <svg className="mx-auto mb-3 text-slate-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1 1 .3 2.703-1.065 2.703H4.863c-1.364 0-2.063-1.703-1.063-2.703L5 14.5" />
  </svg>
)

const IngredienteList = ({ ingredientes, onEditar, onEliminar }: IngredienteListProps) => {
  if (ingredientes.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 animate-fade-in">
        <EmptyIcon />
        <p className="text-base font-medium text-slate-500">Sin ingredientes aún</p>
        <p className="text-sm mt-1">Hacé clic en "＋ Nuevo Ingrediente" para empezar.</p>
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
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">Alérgeno</th>
            <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {ingredientes.map((ingrediente, index) => (
            <tr key={ingrediente.id} className="border-b border-slate-100 hover:bg-orange-50/40 transition-colors duration-150 group">
              <td className="px-5 py-3.5 text-slate-400 text-sm tabular-nums">{index + 1}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{ingrediente.nombre}</td>
              <td className="px-5 py-3.5 text-slate-500 text-sm">{ingrediente.descripcion || '—'}</td>
              <td className="px-5 py-3.5 text-center">
                {ingrediente.es_alergeno ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    {/* Warning icon SVG */}
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 1a.5.5 0 0 1 .437.257l7 12A.5.5 0 0 1 15 14H1a.5.5 0 0 1-.437-.743l7-12A.5.5 0 0 1 8 1zm0 4a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 5zm0 6a.75.75 0 1 0 0 1.5A.75.75 0 0 0 8 11z"/>
                    </svg>
                    Alérgeno
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    Sin riesgo
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => onEditar(ingrediente)}
                    aria-label={`Editar ${ingrediente.nombre}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors duration-150 cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(ingrediente.id)}
                    aria-label={`Eliminar ${ingrediente.nombre}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IngredienteList
